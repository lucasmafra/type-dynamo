import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

export interface GetResult<TableModel, KeySchema> {
  data: TableModel
}

export const get = async <Entity, KeySchema>(
  getInput: DynamoDB.GetItemInput, dynamoClient: DynamoToPromise,
): Promise<GetResult<Entity, KeySchema>> => {
  const getOutput = await dynamoClient.getItem(getInput)
  if (!getOutput.Item) {
    throw new Error('ItemNotFound')
  }
  const result: GetResult<Entity, KeySchema> = {
    data: getOutput.Item as any,
  }
  return result
}
