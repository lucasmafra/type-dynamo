import { DynamoDB } from 'aws-sdk'
import { BatchWriteItemInput } from 'aws-sdk/clients/dynamodb'
import { IBatchWriteInput, IBatchWriteResult, IHelpers } from '../types'

export class BatchWrite {
  private MAX_ITEMS_PER_BATCH = 25
  private INITIAL_BACKOFF_TIME = 100 // ms
  private MAX_BACKOFF_TIME = 1000 // ms

  constructor(
    private dynamoClient: DynamoDB, private helpers: IHelpers,
  ) { }

  public async execute(
    input: IBatchWriteInput<any>,
  ): Promise<IBatchWriteResult<any>> {
    const dynamoInput = this.buildInputFrom(input)
    const chunks = this.splitInputIntoChunks(dynamoInput, input.tableName)
    for (const chunk of chunks) {
      await this.batchWriteItem(chunk)
    }
    return {data: input.items}
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
    let backoffTime = this.INITIAL_BACKOFF_TIME
    let requestFailed = false
    do {
      if (Object.keys(unprocessedItems).length) {
        input = {...input, RequestItems: unprocessedItems}
      }
      try {
        const {
          UnprocessedItems,
        } = await this.dynamoClient.batchWriteItem(input).promise()
        unprocessedItems = UnprocessedItems || {}
        requestFailed = false
      } catch (err) {
        requestFailed = true
        switch (err.code) {
          case 'ProvisionedThroughputExceededException': {
            await this.helpers.timeout.wait(backoffTime)
            backoffTime *= 2
            break
          }
          default:
            throw err
        }
      }
    } while (
        Object.keys(unprocessedItems).length  ||
        (requestFailed && backoffTime < this.MAX_BACKOFF_TIME)
    )
  }

  private splitInputIntoChunks(
    input: BatchWriteItemInput, tableName: string,
  ): BatchWriteItemInput[] {
    let chunk = 0
    return input.RequestItems[tableName].reduce((acc, value, index) => {
      if (index % this.MAX_ITEMS_PER_BATCH === 0 && index !== 0) {
        chunk++
        acc[chunk] = {RequestItems: {[tableName]: []}}
      }
      acc[chunk].RequestItems[tableName] = [
        ...acc[chunk].RequestItems[tableName], value,
      ]
      return acc
    }, new Array<BatchWriteItemInput>({
      RequestItems: {[tableName]: []},
    }))
  }
}
