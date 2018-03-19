import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'
import { deepClone } from '../helpers'
export interface BatchWriteResult<TableModel> {
    data: TableModel[]
}

const segmentBatchWriteInputs = (batchWriteInput: DynamoDB.BatchWriteItemInput) => {
    const RequestItems = deepClone(batchWriteInput.RequestItems)
    const tableName = Object.keys(RequestItems)[0]
    const segments = new Array<DynamoDB.BatchWriteItemInput>()
    do {
        const segment = deepClone(batchWriteInput)
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

const singleBatchWrite = async <Entity> (
    batchWriteInput: DynamoDB.BatchWriteItemInput,
    dynamoPromise: DynamoToPromise,
) => {
    let batchWriteOutput = await dynamoPromise.batchWrite(batchWriteInput)
    while (batchWriteOutput.UnprocessedItems && Object.keys(batchWriteOutput.UnprocessedItems).length) {
        batchWriteInput.RequestItems = batchWriteOutput.UnprocessedItems
        batchWriteOutput = await dynamoPromise.batchWrite(batchWriteInput)
    }
}

export async function batchWrite<
    Entity
>(
    items: Entity[], batchWriteInput: DynamoDB.BatchWriteItemInput, dynamoPromise: DynamoToPromise,
): Promise<BatchWriteResult<Entity>> {
    const segmentedBatchWriteInputs = segmentBatchWriteInputs(batchWriteInput)
    const batchWrites = segmentedBatchWriteInputs.map( (segment) => singleBatchWrite(
        segment, dynamoPromise,
    ))
    await Promise.all(batchWrites)
    const result: BatchWriteResult<Entity> = {
        data: items,
    }
    return result
}
