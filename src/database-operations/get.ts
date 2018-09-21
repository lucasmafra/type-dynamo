import { DynamoDB } from 'aws-sdk'
import DynamoClient from './dynamo-client'
import { WithAttributes } from './helpers/with-attributes'

export interface IGetInput<KeySchema> {
  tableName: string,
  key: KeySchema,
}

export interface IGetOptions {
  withAttributes?: string[]
}

export interface IGetResult<Model, KeySchema> {
  data: Model
}

export class Get<Model, KeySchema> {
  public dynamoClient: DynamoClient

  public constructor(dynamoClient: DynamoClient) {
    this.dynamoClient = dynamoClient
  }

  public execute = async (
    input: IGetInput<KeySchema>, options: IGetOptions = {},
  ): Promise<IGetResult<Model, KeySchema>> => {
    const dynamoGetInput = this.buildDynamoGetInput(input, options)
    const getOutput = await this.dynamoClient.getItem(dynamoGetInput)
    if (!getOutput.Item) {
      throw new Error('ItemNotFound')
    }
    return {
      data: getOutput.Item as any,
    }
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
      const {
        ProjectionExpression,
        ExpressionAttributeNames,
      } = new WithAttributes().build(withAttributes)
      dynamoInput.ProjectionExpression = ProjectionExpression
      dynamoInput.ExpressionAttributeNames = ExpressionAttributeNames
    }
    return dynamoInput
  }
}
