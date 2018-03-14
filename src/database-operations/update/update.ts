import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface UpdateResult<TableModel> {
    data: TableModel
}

export async function update<Entity>(updateInput: DynamoDB.UpdateItemInput): Promise<UpdateResult<Entity>> {
    const updateOutput = await dynamoPromise.update(updateInput)
    const result: UpdateResult<Entity> = {
        data: updateOutput.Attributes as any,
    }
    return result
}
