import { DynamoDB } from 'aws-sdk'
import { WithAttributes } from '../../chaining/common'
import { IGetInput as IGet } from '../../chaining/find/get/get'
import { buildKey, projectionExpression } from '../helpers'

export interface IGetResult<Model, KeySchema> {
  data: Model
}

export interface IGetOptions {
  withAttributes?: WithAttributes
}

export class Get<Model, KeySchema> {
  public execute = async (
    input: IGet<KeySchema>, options: IGetOptions = {},
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
    input: IGet<KeySchema>, options: IGetOptions,
  ) => {
    const { withAttributes } = options
    const dynamoInput: DynamoDB.GetItemInput = {
      TableName: input.schema.tableName,
      Key: buildKey(input.key),
    }
    if (withAttributes) {
      dynamoInput.ProjectionExpression = projectionExpression(
        withAttributes.attributes,
      )
      dynamoInput.ExpressionAttributeNames = withAttributes.
        expressionAttributeNames
    }
    return dynamoInput
  }
}
