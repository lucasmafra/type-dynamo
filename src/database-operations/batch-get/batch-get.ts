import { AWSError, DynamoDB } from 'aws-sdk'
import { merge } from 'lodash'
import DynamoToPromise from '../dynamo-to-promise'
import { timeoutPromise } from '../helpers'
import { deepClone } from '../helpers'
const marshalItem = require('dynamodb-marshaler').marshalItem

const BATCH_GET_LIMIT = 100 // items
const INITIAL_BACKOFF = 50 // ms
const MAX_BACKOFF = 1000 // ms

export interface BatchGetResult<TableModel, KeySchema> {
    data: TableModel[]
}

const segmentBatchGetInputs = (batchGetInput: DynamoDB.BatchGetItemInput) => {
    const RequestItems = deepClone(batchGetInput.RequestItems) as DynamoDB.BatchGetRequestMap
    const tableName = Object.keys(RequestItems)[0]
    const segments = new Array<DynamoDB.BatchGetItemInput>()
    do {
        const segment = deepClone(batchGetInput) as DynamoDB.BatchGetItemInput
        segment.RequestItems[tableName].Keys = RequestItems[tableName].Keys.slice(0, BATCH_GET_LIMIT)
        segments.push(segment)
        if (RequestItems[tableName].Keys.length > BATCH_GET_LIMIT) {
            RequestItems[tableName].Keys = RequestItems[tableName].Keys.slice(
                BATCH_GET_LIMIT, RequestItems[tableName].Keys.length,
            )
        } else {
            RequestItems[tableName].Keys = []
        }
    } while (RequestItems[tableName].Keys.length)
    return segments
}

const singleBatchGet = async <Entity, KeySchema> (
    batchGetInput: DynamoDB.BatchGetItemInput,
    dynamoPromise: DynamoToPromise,
) => {
    const tableName =  Object.keys(batchGetInput.RequestItems)[0]
    try {
        const batchGetOutput = await dynamoPromise.batchGet(batchGetInput)
        if (batchGetOutput.UnprocessedKeys && Object.keys(batchGetOutput.UnprocessedKeys).length) {
            batchGetInput.RequestItems[tableName].Keys =
                batchGetOutput.UnprocessedKeys[tableName].Keys.map( (key) => (
                    marshalItem(key)
                ))
            return { batchGetOutput, batchGetInput }
        }
        return { batchGetOutput, batchGetInput: undefined }
    } catch (err) {
        if ((err as AWSError).code === 'ProvisionedThroughputExceededException') {
            return { batchGetInput, batchGetOutput: undefined }
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

const initalizeAcc = (tableName: string, batchGetInput: DynamoDB.BatchGetItemInput) => {
    const clone = deepClone(batchGetInput) as DynamoDB.BatchGetItemInput
    clone.RequestItems[tableName].Keys = []
    return clone
}
export async function batchGet<
    Entity, KeySchema
>(
    tableName: string, batchGetInput: DynamoDB.BatchGetItemInput, dynamoPromise: DynamoToPromise,
): Promise<BatchGetResult<Entity, KeySchema>> {
    let unprocessed = batchGetInput
    let partial = new Array<Entity>()
    do {
        const segments = segmentBatchGetInputs(unprocessed)
        const batchGets = segments.map( (segment) => singleBatchGet<Entity, KeySchema>(
            segment, dynamoPromise,
        ))
        unprocessed = (await Promise.all(batchGets)).reduce((acc, current) => {
            if (current.batchGetInput) {
                acc!.RequestItems[tableName].Keys =
                    mergeArray(acc!.RequestItems[tableName].Keys, current.batchGetInput.RequestItems[tableName].Keys)
            }
            if (current.batchGetOutput && current.batchGetOutput.Responses) {
                partial = partial.concat(current.batchGetOutput.Responses[tableName] as any)
            }
            return acc
        }, initalizeAcc(tableName, batchGetInput))!
    } while (unprocessed.RequestItems[tableName].Keys.length)
    return { data: partial }
}
