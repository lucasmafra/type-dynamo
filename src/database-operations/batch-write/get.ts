import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface GetResult<TableModel, KeySchema> {
    data: TableModel
}

export async function get<
    Entity, KeySchema
>(getInput: DynamoDB.GetItemInput): Promise<GetResult<Entity, KeySchema>> {
    const getOutput = await dynamoPromise.getItem(getInput)
    if (!getOutput.Item) {
        throw new Error('ItemNotFound')
    }
    const result: GetResult<Entity, KeySchema> = {
        data: getOutput.Item as any,
    }
    return result
}
