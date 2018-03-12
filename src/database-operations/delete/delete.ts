import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface DeleteResult<TableModel> {
    data: TableModel
}

export async function deleteItem<
    Entity
>(deleteInput: DynamoDB.DeleteItemInput): Promise<DeleteResult<Entity>> {
    const deleteOutput = await dynamoPromise.delete(deleteInput)
    if (!deleteOutput.Attributes || Object.keys(!deleteOutput.Attributes).length) {
        throw new Error('ItemNotFound')
    }
    const result: DeleteResult<Entity> = {
        data: deleteOutput.Attributes as any,
    }
    return result
}
