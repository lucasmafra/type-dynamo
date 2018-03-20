import { AWSError, DynamoDB } from 'aws-sdk'
import { merge } from 'lodash'
import DynamoToPromise from '../dynamo-to-promise'
import { timeoutPromise } from '../helpers'
import { deepClone } from '../helpers'
const marshalItem = require('dynamodb-marshaler').marshalItem

const BATCH_WRITE_LIMIT = 25 // items
const INITIAL_BACKOFF = 50 // ms
const MAX_BACKOFF = 1000 // ms

export interface BatchDeleteResult {}

const segmentBatchDeleteInputs = (batchDeleteInput: DynamoDB.BatchWriteItemInput) => {
    const RequestItems = deepClone(batchDeleteInput.RequestItems)
    const tableName = Object.keys(RequestItems)[0]
    const segments = new Array<DynamoDB.BatchWriteItemInput>()
    do {
        const segment = deepClone(batchDeleteInput)
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

const singleBatchDelete = async (
    batchDeleteInput: DynamoDB.BatchWriteItemInput,
    dynamoPromise: DynamoToPromise,
) => {
    const tableName =  Object.keys(batchDeleteInput.RequestItems)[0]
    try {
        const batchDeleteOutput = await dynamoPromise.batchWrite(batchDeleteInput)
        if (batchDeleteOutput.UnprocessedItems && Object.keys(batchDeleteOutput.UnprocessedItems).length) {
            batchDeleteInput.RequestItems[tableName] =
                batchDeleteOutput.UnprocessedItems[tableName].map( (request) => ({
                    DeleteRequest: { Key: marshalItem(request.DeleteRequest!.Key) },
                }))
            return batchDeleteInput
        }
        return undefined
    } catch (err) {
        if ((err as AWSError).code === 'ProvisionedThroughputExceededException') {
            return batchDeleteInput
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

export async function batchDelete(
    batchDeleteInput: DynamoDB.BatchWriteItemInput, dynamoPromise: DynamoToPromise,
): Promise<BatchDeleteResult> {
    let unprocessed = batchDeleteInput
    const tableName = Object.keys(unprocessed.RequestItems)[0]
    do {
        const segments = segmentBatchDeleteInputs(unprocessed)
        const batchDeletes = segments.map( (segment) => singleBatchDelete(
            segment, dynamoPromise,
        ))
        unprocessed = (await Promise.all(batchDeletes)).reduce((acc, current) => {
            if (current) {
                acc.RequestItems[tableName] = mergeArray(acc.RequestItems[tableName], current.RequestItems[tableName])
            }
            return acc
        }, { RequestItems : { [tableName]: [] } } as any)
    } while (unprocessed.RequestItems[tableName].length)
    return {}
}
