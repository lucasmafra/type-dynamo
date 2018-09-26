import { DynamoDB } from 'aws-sdk'
import { IGetInput, IGetResult, IHelpers } from '../types'
import DynamoClient from './dynamo-client'

export class Get<Model, KeySchema> {
  private dynamoClient: DynamoClient
  private helpers: IHelpers

  public constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
  ) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
  }

  public execute = async (
    input: IGetInput<KeySchema>,
  ): Promise<IGetResult<Model, KeySchema>> => {
    const dynamoGetInput = this.buildDynamoGetInput(input)
    const getOutput = await this.dynamoClient.getItem(dynamoGetInput)

    if (!getOutput.Item) { throw new Error('ItemNotFound') }

    return { data: getOutput.Item as any }
  }

  private buildDynamoGetInput = (
    input: IGetInput<KeySchema>
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
