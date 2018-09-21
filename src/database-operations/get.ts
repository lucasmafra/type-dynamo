import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../schema'
import { WithAttributes } from './helpers/with-attributes'

export interface IGetInput<KeySchema> {
  schema: EntitySchema,
  key: KeySchema,
}

export interface IGetOptions {
  withAttributes?: string[]
}

export interface IGetResult<Model, KeySchema> {
  data: Model
}

export class Get<Model, KeySchema> {
  public execute = async (
    input: IGetInput<KeySchema>, options: IGetOptions = {},
  ): Promise<IGetResult<Model, KeySchema>> => {
    const { schema: { dynamoPromise: dynamoClient } } = input
    const dynamoGetInput = this.buildDynamoGetInput(input, options)
    const getOutput = await dynamoClient.getItem(dynamoGetInput)
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
      TableName: input.schema.tableName,
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
