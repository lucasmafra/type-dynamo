import { AWSError, DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../../schema'
import DynamoToPromise from '../dynamo-to-promise'
import { WithAttributes } from '../helpers/with-attributes'

export interface IBatchGetInput<KeySchema> {
  schema: EntitySchema,
  keys: KeySchema[],
}

export interface IBatchGetOptions {
  withAttributes?: string[]
}

export interface IBatchGetResult<Model, KeySchema> {
  data: Model[]
}

export class BatchGet<Model, KeySchema> {
  public async execute(
    input: IBatchGetInput<KeySchema>,
    options: IBatchGetOptions = {},
  ): Promise<IBatchGetResult<Model, KeySchema>> {
    const { schema: { dynamoPromise: dynamoClient, tableName }, keys } = input
    const chunks = this.groupKeysInChunks(keys)
    const batchRequests = chunks.map((chunk) => this.batchRequest(
      tableName, chunk, dynamoClient, options),
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
    tableName: string,
    keys: KeySchema[],
    dynamoClient: DynamoToPromise,
    options: IBatchGetOptions,
  ): Promise<IBatchGetResult<Model, KeySchema>> {
    const data = new Array<Model>()
    const dynamoBatchGetInput = this.buildDynamoBatchGetInput(
      tableName, keys, options,
    )
    let {
      Responses, UnprocessedKeys,
    } = await dynamoClient.batchGet(dynamoBatchGetInput)
    if (Responses) {
      data.push(...Responses[tableName].map(
        (item) => DynamoDB.Converter.unmarshall(item),
      ) as any)
    }
    while (UnprocessedKeys) {
      const nextInput = {RequestItems: UnprocessedKeys}
      const nextCall = await dynamoClient.batchGet(nextInput)
      Responses = nextCall.Responses
      UnprocessedKeys = nextCall.UnprocessedKeys
      if (Responses) {
        data.push(...Responses[tableName].map(
          (item) => DynamoDB.Converter.unmarshall(item),
        ) as any)
      }
    }
    return { data }
  }

  private buildDynamoBatchGetInput(
    tableName: string,
    keys: KeySchema[],
    options: IBatchGetOptions,
  ) {
    const dynamoBatchGetInput: DynamoDB.BatchGetItemInput = {
      RequestItems: {
        [tableName]: {
          Keys: keys.map((key) => DynamoDB.Converter.marshall(key)),
        },
      },
    }
    if (options.withAttributes) {
      const {
        ProjectionExpression, ExpressionAttributeNames,
      } = new WithAttributes().build(options.withAttributes)

      dynamoBatchGetInput.RequestItems[tableName]
        .ProjectionExpression = ProjectionExpression

      dynamoBatchGetInput.RequestItems[tableName]
        .ExpressionAttributeNames = ExpressionAttributeNames
    }
    return dynamoBatchGetInput
  }

  private async resolveBatchRequests(
    requests: Array<Promise<IBatchGetResult<Model, KeySchema>>>,
  ): Promise<IBatchGetResult<Model, KeySchema>> {
    const data = []
    for (const request of requests) {
      const { data: partialResult } = await request
      data.push(...partialResult)
    }
    return { data }
  }
}
