import { DynamoDB } from 'aws-sdk'
import { WithAttributes } from '../../chaining/common'
import { Get as IGet } from '../../chaining/find/get/get'
import { buildKey, projectionExpression } from '../helpers'

export interface IGetResult<TableModel, KeySchema> {
  data: TableModel
}

export interface IGetOptions {
  withAttributes?: WithAttributes
}

export class Get<Entity, KeySchema> {
  public input: IGet<KeySchema>

  public constructor(input: IGet<KeySchema>) {
    this.input = input
  }

  public execute = async (
    options: IGetOptions = {},
  ): Promise<IGetResult<Entity, KeySchema>> => {
    const { schema: { dynamoPromise: dynamoClient } } = this.input
    const dynamoGetInput = this.buildDynamoGetInput(options)
    const getOutput = await dynamoClient.getItem(dynamoGetInput)
    if (!getOutput.Item) {
      throw new Error('ItemNotFound')
    }
    return {
      data: getOutput.Item as any,
    }
  }

  private buildDynamoGetInput = (options: IGetOptions) => {
    const { withAttributes } = options
    const dynamoInput: DynamoDB.GetItemInput = {
      TableName: this.input.schema.tableName,
      Key: buildKey(this.input.key),
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
