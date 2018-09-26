import { AWSError, DynamoDB } from 'aws-sdk'
import { IBatchGetInput, IBatchGetResult, IHelpers } from '../types'
import DynamoClient from './dynamo-client'

export class BatchGet<Model, KeySchema> {
  private dynamoClient: DynamoClient
  private helpers: IHelpers

  public constructor(dynamoClient: DynamoClient, helpers: IHelpers) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
  }

  public async execute(
    input: IBatchGetInput<KeySchema>,
  ): Promise<IBatchGetResult<Model>> {
    const chunks = this.groupKeysInChunks(input.keys)
    const batchRequests = chunks.map((chunk) => () => this.batchRequest(
      { ...input, keys: chunk },
      ),
    )
    return this.resolveBatchRequests(batchRequests)
  }

  private groupKeysInChunks(keys: KeySchema[]) {
    let index = 0
    const MAX_ITEMS_PER_BATCH = 100
    return keys.reduce((acc, key) => {
      if (acc[index].length === MAX_ITEMS_PER_BATCH) {
        index++
        acc[index] = acc[index] || new Array<KeySchema>()
      }
      acc[index].push(key)
      return acc
    }, new Array<KeySchema[]>([]))
  }

  private async batchRequest(
    input: IBatchGetInput<KeySchema>,
  ): Promise<IBatchGetResult<Model>> {
    const data = new Array<Model>()
    const dynamoBatchGetInput = this.buildDynamoBatchGetInput(input)
    let {
      Responses, UnprocessedKeys,
    } = await this.dynamoClient.batchGet(dynamoBatchGetInput)
    if (Responses) {
      data.push(...Responses[input.tableName].map(
        (item) => DynamoDB.Converter.unmarshall(item),
      ) as any)
    }
    while (UnprocessedKeys) {
      const nextInput = {RequestItems: UnprocessedKeys}
      const nextCall = await this.dynamoClient.batchGet(nextInput)
      Responses = nextCall.Responses
      UnprocessedKeys = nextCall.UnprocessedKeys
      if (Responses) {
        data.push(...Responses[input.tableName].map(
          (item) => DynamoDB.Converter.unmarshall(item),
        ) as any)
      }
    }
    return { data }
  }

  private buildDynamoBatchGetInput(
    input: IBatchGetInput<KeySchema>,
  ) {
    const dynamoBatchGetInput: DynamoDB.BatchGetItemInput = {
      RequestItems: {
        [input.tableName]: {
          Keys: input.keys.map((key) => DynamoDB.Converter.marshall(key)),
        },
      },
    }
    if (input.withAttributes) {
      const { projectionExpression, expressionAttributeNames } = this.helpers
        .withAttributesGenerator.generateExpression(input.withAttributes)

      dynamoBatchGetInput.RequestItems[input.tableName]
        .ProjectionExpression = projectionExpression

      dynamoBatchGetInput.RequestItems[input.tableName]
        .ExpressionAttributeNames = expressionAttributeNames
    }
    return dynamoBatchGetInput
  }

  private async resolveBatchRequests(
    requests: Array<() => Promise<IBatchGetResult<Model>>>,
  ): Promise<IBatchGetResult<Model>> {
    const data = []
    for (const request of requests) {
      let currentBackoff = 100
      const backoffLimit = 1000
      let requestSucceeded = false
      while (currentBackoff < backoffLimit && !requestSucceeded) {
        try {
          const { data: partialResult } = await request()
          data.push(...partialResult)
          requestSucceeded = true
        } catch (err) {
          switch ((err as AWSError).code) {
            case 'ProvisionedThroughputExceededException':
              await this.helpers.timeout.wait(currentBackoff)
              currentBackoff *= 2
              break
            default:
              throw err
          }
        }
      }
    }
    return { data }
  }
}
