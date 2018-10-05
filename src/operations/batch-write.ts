import { DynamoDB } from 'aws-sdk'

export interface IBatchWriteInput<Model> {
  tableName: string
  items: Model[]
}

export interface IBatchWriteResult<Model> {
  data: Model[]
}

export class BatchWrite {
  constructor(private dynamoClient: DynamoDB) { }

  public async execute(input: IBatchWriteInput<any>) {
    const dynamoInput = this.buildInputFrom(input)
    await this.dynamoClient.batchWriteItem(dynamoInput).promise()
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
}
