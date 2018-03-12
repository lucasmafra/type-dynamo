import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface BatchDeleteResult<TableModel> {}

export async function batchDelete<
    Entity
>(
    items: Entity[], batchDeleteInput: DynamoDB.BatchWriteItemInput,
): Promise<BatchDeleteResult<Entity>> {
    let batchDeleteOutput = await dynamoPromise.batchWrite(batchDeleteInput)
    while (batchDeleteOutput.UnprocessedItems && Object.keys(batchDeleteOutput.UnprocessedItems).length) {
        batchDeleteInput.RequestItems = batchDeleteOutput.UnprocessedItems
        batchDeleteOutput = await dynamoPromise.batchWrite(batchDeleteInput)
    }
    const result: BatchDeleteResult<Entity> = {
        data: items,
    }
    return result
}
