import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

export interface BatchWriteResult<TableModel> {
    data: TableModel[]
}

export async function batchWrite<
    Entity
>(
    items: Entity[], batchWriteInput: DynamoDB.BatchWriteItemInput, dynamoPromise: DynamoToPromise,
): Promise<BatchWriteResult<Entity>> {
    let batchWriteOutput = await dynamoPromise.batchWrite(batchWriteInput)
    while (batchWriteOutput.UnprocessedItems && Object.keys(batchWriteOutput.UnprocessedItems).length) {
        batchWriteInput.RequestItems = batchWriteOutput.UnprocessedItems
        batchWriteOutput = await dynamoPromise.batchWrite(batchWriteInput)
    }
    const result: BatchWriteResult<Entity> = {
        data: items,
    }
    return result
}
