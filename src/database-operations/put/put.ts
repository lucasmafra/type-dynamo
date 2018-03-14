import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

export interface PutResult<TableModel> {
    data: TableModel
}

export async function put<
    Entity
>(item: Entity, putInput: DynamoDB.PutItemInput, dynamoPromise: DynamoToPromise): Promise<PutResult<Entity>> {
    const putOutput = await dynamoPromise.put(putInput)
    const result: PutResult<Entity> = {
        data: item,
    }
    return result
}
