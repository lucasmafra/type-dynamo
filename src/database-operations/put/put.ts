import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface PutResult<TableModel> {
    data: TableModel
}

export async function put<
    Entity
>(putInput: DynamoDB.PutItemInput): Promise<PutResult<Entity>> {
    const putOutput = await dynamoPromise.put(putInput)
    const result: PutResult<Entity> = {
        data: putInput.Item as any,
    }
    return result
}
