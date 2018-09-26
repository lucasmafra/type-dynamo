import { DynamoDB } from 'aws-sdk'
import DynamoClient from '../dynamo-client'

export interface DeleteResult<TableModel> {
    data: TableModel
}

export async function deleteItem<
    Entity
>(deleteInput: DynamoDB.DeleteItemInput, dynamoClient: DynamoClient): Promise<DeleteResult<Entity>> {
    const deleteOutput = await dynamoClient.delete(deleteInput)
    if (!deleteOutput.Attributes || Object.keys(!deleteOutput.Attributes).length) {
        throw new Error('ItemNotFound')
    }
    const result: DeleteResult<Entity> = {
        data: deleteOutput.Attributes as any,
    }
    return result
}
