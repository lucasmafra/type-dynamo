import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface BatchGetResult<TableModel, KeySchema> {
    data: TableModel[]
}

export async function batchGet<
    Entity, KeySchema
>(tableName: string, batchGetInput: DynamoDB.BatchGetItemInput): Promise<BatchGetResult<Entity, KeySchema>> {
    let batchGetOutput = await dynamoPromise.batchGet(batchGetInput)
    let partialResult = batchGetOutput.Responses ? batchGetOutput.Responses[tableName] : new Array<Entity>()
    while (batchGetOutput.UnprocessedKeys && batchGetOutput.UnprocessedKeys[tableName]) {
        partialResult = (partialResult as any).concat((batchGetOutput.Responses![tableName]))
        batchGetInput.RequestItems[tableName].Keys = batchGetOutput.UnprocessedKeys[tableName].Keys
        batchGetOutput = await dynamoPromise.batchGet(batchGetInput)
    }
    const result: BatchGetResult<Entity, KeySchema> = {
        data: partialResult as any,
    }
    return result
}
