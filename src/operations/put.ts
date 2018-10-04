import { DynamoDB } from 'aws-sdk'
import { PutItemInput, PutItemOutput } from 'aws-sdk/clients/dynamodb'
import { IPutInput, IPutOutput } from '../types'

export class Put {
  public constructor(
    private dynamoClient: DynamoDB,
  ) { }

  public async execute(input: IPutInput<any>) {
    const dynamoInput = this.buildDynamoInputFrom(input)
    return this.parseResponse(
      await this.dynamoClient.putItem(dynamoInput).promise(),
    )
  }

  private buildDynamoInputFrom(input: IPutInput<any>): PutItemInput {
    return {
      TableName: input.tableName,
      Item: DynamoDB.Converter.marshall(input.item),
      ReturnValues: 'ALL_NEW',
    }
  }

  private parseResponse(response: PutItemOutput): IPutOutput<any> {
    return {
      data: DynamoDB.Converter.unmarshall(response.Attributes!),
    }
  }
}
