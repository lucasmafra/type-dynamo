import { AWSError, DynamoDB } from 'aws-sdk'
import { merge } from 'lodash'
import DynamoClient from '../dynamo-client'
import { timeoutPromise } from '../helpers'
import { deepClone } from '../helpers'
const marshalItem = require('dynamodb-marshaler').marshalItem

const BATCH_WRITE_LIMIT = 25 // items
const INITIAL_BACKOFF = 50 // ms
const MAX_BACKOFF = 1000 // ms

export interface BatchWriteResult<TableModel> {
    data: TableModel[]
}

const segmentBatchWriteInputs = (batchWriteInput: DynamoDB.BatchWriteItemInput) => {
    const RequestItems = deepClone(batchWriteInput.RequestItems)
    const tableName = Object.keys(RequestItems)[0]
    const segments = new Array<DynamoDB.BatchWriteItemInput>()
    do {
        const segment = deepClone(batchWriteInput)
        segment.RequestItems[tableName] = RequestItems[tableName].slice(0, BATCH_WRITE_LIMIT)
        segments.push(segment)
        if (RequestItems[tableName].length > BATCH_WRITE_LIMIT) {
            RequestItems[tableName] = RequestItems[tableName].slice(
                BATCH_WRITE_LIMIT, RequestItems[tableName].length,
            )
        } else {
            RequestItems[tableName] = []
        }
    } while (RequestItems[tableName].length)
    return segments
}

const singleBatchWrite = async <Entity> (
    batchWriteInput: DynamoDB.BatchWriteItemInput,
    dynamoClient: DynamoClient,
) => {
    const tableName =  Object.keys(batchWriteInput.RequestItems)[0]
    try {
        const batchWriteOutput = await dynamoClient.batchWrite(batchWriteInput)
        if (batchWriteOutput.UnprocessedItems && Object.keys(batchWriteOutput.UnprocessedItems).length) {
            batchWriteInput.RequestItems[tableName] =
                batchWriteOutput.UnprocessedItems[tableName].map( (request) => ({
                    PutRequest: { Item: marshalItem(request.PutRequest!.Item) },
                }))
            return batchWriteInput
        }
        return undefined
    } catch (err) {
        if ((err as AWSError).code === 'ProvisionedThroughputExceededException') {
            return batchWriteInput
        } else {
            throw new Error('UnknownError')
        }
    }
}

const mergeArray = (arr1: any[], arr2: any[]) => {
    let arrMerge = new Array()
    arrMerge = arrMerge.concat(arr1)
    arrMerge = arrMerge.concat(arr2)
    return arrMerge
}

export async function batchWrite<
    Entity
>(
    items: Entity[], batchWriteInput: DynamoDB.BatchWriteItemInput, dynamoClient: DynamoClient,
): Promise<BatchWriteResult<Entity>> {
    let unprocessed = batchWriteInput
    const tableName = Object.keys(unprocessed.RequestItems)[0]
    do {
        const segments = segmentBatchWriteInputs(unprocessed)
        const batchWrites = segments.map( (segment) => singleBatchWrite<Entity>(
            segment, dynamoClient,
        ))
        unprocessed = (await Promise.all(batchWrites)).reduce((acc, current) => {
            if (current) {
                acc.RequestItems[tableName] = mergeArray(acc.RequestItems[tableName], current.RequestItems[tableName])
            }
            return acc
        }, { RequestItems : { [tableName]: [] } } as any)
    } while (unprocessed.RequestItems[tableName].length)
    return { data: items }
}
