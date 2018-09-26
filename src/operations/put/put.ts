import { DynamoDB } from 'aws-sdk'
import DynamoClient from '../dynamo-client'

export interface PutResult<TableModel> {
    data: TableModel
}

export async function put<
    Entity
>(item: Entity, putInput: DynamoDB.PutItemInput, dynamoClient: DynamoClient): Promise<PutResult<Entity>> {
    const putOutput = await dynamoClient.put(putInput)
    const result: PutResult<Entity> = {
        data: item,
    }
    return result
}
