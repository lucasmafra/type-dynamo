import { DynamoDB } from 'aws-sdk'
import { IHelpers } from '../helpers'
import DynamoClient from './dynamo-client'

export interface IGetInput<KeySchema> { tableName: string, key: KeySchema }

export interface IGetOptions { withAttributes?: string[] }

export interface IGetResult<Model, KeySchema> { data: Model }

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
    input: IGetInput<KeySchema>, options: IGetOptions = {},
  ): Promise<IGetResult<Model, KeySchema>> => {
    const dynamoGetInput = this.buildDynamoGetInput(input, options)
    const getOutput = await this.dynamoClient.getItem(dynamoGetInput)

    if (!getOutput.Item) { throw new Error('ItemNotFound') }

    return { data: getOutput.Item as any }
  }

  private buildDynamoGetInput = (
    input: IGetInput<KeySchema>, options: IGetOptions,
  ) => {
    const { withAttributes } = options
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
