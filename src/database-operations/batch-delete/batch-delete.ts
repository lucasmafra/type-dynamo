import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'
import { deepClone } from '../helpers'

export interface BatchDeleteResult<TableModel> {}

const segmentBatchDeleteInputs = (batchDeleteInput: DynamoDB.BatchWriteItemInput) => {
    const RequestItems = deepClone(batchDeleteInput.RequestItems)
    const tableName = Object.keys(RequestItems)[0]
    const segments = new Array<DynamoDB.BatchWriteItemInput>()
    do {
        const segment = deepClone(batchDeleteInput)
        segment.RequestItems[tableName] = deepClone(RequestItems[tableName].slice(0, 25)),
        segments.push(segment)
        if (RequestItems[tableName].length > 25) {
            RequestItems[tableName] = RequestItems[tableName].slice(25, RequestItems[tableName].length)
        } else {
            RequestItems[tableName] = []
        }
    } while (RequestItems[tableName].length)
    return segments
}

const singleBatchDelete = async <Entity> (
    batchDeleteInput: DynamoDB.BatchWriteItemInput,
    dynamoPromise: DynamoToPromise,
) => {
    let batchDeleteOutput = await dynamoPromise.batchWrite(batchDeleteInput)
    while (batchDeleteOutput.UnprocessedItems && Object.keys(batchDeleteOutput.UnprocessedItems).length) {
        batchDeleteInput.RequestItems = batchDeleteOutput.UnprocessedItems
        batchDeleteOutput = await dynamoPromise.batchWrite(batchDeleteInput)
    }
}

export async function batchDelete<
    Entity
>(
    items: Entity[], batchDeleteInput: DynamoDB.BatchWriteItemInput, dynamoPromise: DynamoToPromise,
): Promise<BatchDeleteResult<Entity>> {
    const segmentedBatchDeleteInputs = segmentBatchDeleteInputs(batchDeleteInput)
    const batchDeletes = segmentedBatchDeleteInputs.map( (segment) => singleBatchDelete(
        segment, dynamoPromise,
    ))
    await Promise.all(batchDeletes)
    return {}
}
