import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

export interface BatchGetResult<TableModel, KeySchema> {
    data: TableModel[]
}

export async function batchGet<
    Entity, KeySchema
>(
    tableName: string, batchGetInput: DynamoDB.BatchGetItemInput, dynamoPromise: DynamoToPromise,
): Promise<BatchGetResult<Entity, KeySchema>> {
    let batchGetOutput = await dynamoPromise.batchGet(batchGetInput)
    let partialResult = batchGetOutput.Responses ? batchGetOutput.Responses[tableName] : new Array<Entity>()
    while (batchGetOutput.UnprocessedKeys && Object.keys(batchGetOutput.UnprocessedKeys).length) {
        if (batchGetOutput.Responses && batchGetOutput.Responses[tableName]) {
            partialResult = (partialResult as any).concat((batchGetOutput.Responses[tableName]))
        }
        batchGetInput.RequestItems = batchGetOutput.UnprocessedKeys
        batchGetOutput = await dynamoPromise.batchGet(batchGetInput)
    }
    const result: BatchGetResult<Entity, KeySchema> = {
        data: partialResult as any,
    }
    return result
}
