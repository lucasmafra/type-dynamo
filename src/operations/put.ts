import { DynamoDB } from 'aws-sdk'
import { PutItemInput } from 'aws-sdk/clients/dynamodb'
import { IPutInput, IPutResult } from '../types'

export class Put {
  public constructor(
    private dynamoClient: DynamoDB,
  ) { }

  public async execute(input: IPutInput<any>): Promise<IPutResult<any>> {
    const dynamoInput = this.buildDynamoInputFrom(input)
    await this.dynamoClient.putItem(dynamoInput).promise()
    return { data: input.item }
  }

  private buildDynamoInputFrom(input: IPutInput<any>): PutItemInput {
    return {
      TableName: input.tableName,
      Item: DynamoDB.Converter.marshall(input.item),
    }
  }
}
