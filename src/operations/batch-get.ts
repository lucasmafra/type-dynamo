import { AWSError, DynamoDB } from 'aws-sdk'
import { IBatchGetInput, IBatchGetResult, IHelpers } from '../types'

export class BatchGet {
  public constructor(
    private dynamoClient: DynamoDB, private helpers: IHelpers,
  ) { }

  public async execute(
    input: IBatchGetInput<any>,
  ): Promise<IBatchGetResult<any>> {
    const chunks = this.groupKeysInChunks(input.keys)
    const batchRequests = chunks.map((chunk: any) => () => this.batchRequest(
      { ...input, keys: chunk },
      ),
    )
    return this.resolveBatchRequests(batchRequests)
  }

  private groupKeysInChunks(keys: any[]) {
    let index = 0
    const MAX_ITEMS_PER_BATCH = 100
    return keys.reduce((acc, key) => {
      if (acc[index].length === MAX_ITEMS_PER_BATCH) {
        index++
        acc[index] = acc[index] || new Array<any>()
      }
      acc[index].push(key)
      return acc
    }, new Array<any[]>([]))
  }

  private async batchRequest(
    input: IBatchGetInput<any>,
  ): Promise<IBatchGetResult<any>> {
    const data = new Array<any>()
    const dynamoBatchGetInput = this.buildDynamoBatchGetInput(input)
    let {
      Responses, UnprocessedKeys,
    } = await this.dynamoClient.batchGetItem(dynamoBatchGetInput).promise()
    if (Responses) {
      data.push(...Responses[input.tableName].map(
        (item) => DynamoDB.Converter.unmarshall(item),
      ) as any)
    }
    while (UnprocessedKeys) {
      const nextInput = {RequestItems: UnprocessedKeys}
      const nextCall = await this.dynamoClient.batchGetItem(nextInput).promise()
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
    input: IBatchGetInput<any>,
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
    requests: Array<() => Promise<IBatchGetResult<any>>>,
  ): Promise<IBatchGetResult<any>> {
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
