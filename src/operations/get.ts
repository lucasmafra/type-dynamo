import { DynamoDB } from 'aws-sdk'
import { IGetInput, IGetResult, IHelpers } from '../types'

export class Get {
  public constructor(
    private dynamoClient: DynamoDB, private helpers: IHelpers,
  ) { }

  public execute = async (
    input: IGetInput<any>,
  ): Promise<IGetResult<any, any>> => {
    const dynamoGetInput = this.buildDynamoGetInput(input)
    const getOutput = await this.dynamoClient.getItem(dynamoGetInput).promise()

    if (!getOutput.Item) { throw new Error('ItemNotFound') }

    return { data: DynamoDB.Converter.unmarshall(getOutput.Item) }
  }

  private buildDynamoGetInput = (
    input: IGetInput<any>,
  ) => {
    const { withAttributes } = input
    const dynamoInput: DynamoDB.GetItemInput = {
      TableName: input.tableName,
      Key: DynamoDB.Converter.marshall(input.key),
    }
    if (withAttributes) {
      const { projectionExpression, expressionAttributeNames } = this.helpers.
        withAttributesGenerator.generateExpression(withAttributes)

      dynamoInput.ProjectionExpression = projectionExpression
      dynamoInput.ExpressionAttributeNames = expressionAttributeNames
    }
    return dynamoInput
  }
}
