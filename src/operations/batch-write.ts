import { DynamoDB } from 'aws-sdk'
import { BatchWriteItemInput } from 'aws-sdk/clients/dynamodb'

export interface IBatchWriteInput<Model> {
  tableName: string
  items: Model[]
}

export interface IBatchWriteResult<Model> {
  data: Model[]
}

export class BatchWrite {

  private MAX_ITEMS_PER_BATCH = 25
  constructor(private dynamoClient: DynamoDB) { }

  public async execute(
    input: IBatchWriteInput<any>,
  ): Promise<IBatchWriteResult<any>> {
    const dynamoInput = this.buildInputFrom(input)
    const chunks = this.splitInputIntoChunks(dynamoInput, input.tableName)
    for (const chunk of chunks) {
      await this.batchWriteItem(chunk)
    }
    return { data: input.items }
  }

  private buildInputFrom(input: IBatchWriteInput<any>) {
    return {
      RequestItems: {
        [input.tableName]: input.items.map((item) => ({
          PutRequest: {Item: DynamoDB.Converter.marshall(item)},
        })),
      },
    }
  }

  private async batchWriteItem(input: BatchWriteItemInput) {
    let unprocessedItems: DynamoDB.BatchWriteItemRequestMap = {}
    do {
      if (Object.keys(unprocessedItems).length) {
        input = { ...input, RequestItems: unprocessedItems }
      }
      const {
        UnprocessedItems,
      } = await this.dynamoClient.batchWriteItem(input).promise()
      unprocessedItems = UnprocessedItems || {}
    } while (Object.keys(unprocessedItems).length)
  }

  private splitInputIntoChunks(
    input: BatchWriteItemInput, tableName: string,
  ): BatchWriteItemInput[] {
    let chunk = 0
    return input.RequestItems[tableName].reduce((acc, value, index) => {
      if (index % this.MAX_ITEMS_PER_BATCH === 0 && index !== 0) {
        chunk++
        acc[chunk] = { RequestItems: { [tableName]: [] }}
      }
      acc[chunk].RequestItems[tableName] = [
        ...acc[chunk].RequestItems[tableName], value,
      ]
      return acc
    }, new Array<BatchWriteItemInput>({
      RequestItems: { [tableName]: [] },
    }))
  }
}
