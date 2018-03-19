import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

export interface BatchGetResult<TableModel, KeySchema> {
    data: TableModel[]
}

const segmentBatchGetInputs = (batchGetInput: DynamoDB.BatchGetItemInput) => {
    const RequestItems = Object.assign({}, batchGetInput.RequestItems)
    const tableName = Object.keys(RequestItems)[0]
    const segments = new Array<DynamoDB.BatchGetItemInput>()
    do {
        const segment = Object.assign({}, batchGetInput)
        segment.RequestItems[tableName] = {
                Keys: RequestItems[tableName].Keys.slice(0, 100),
        }
        segments.push(segment)
        if (RequestItems[tableName].Keys.length > 100) {
            RequestItems[tableName].Keys = RequestItems[tableName].Keys.slice(100, RequestItems[tableName].Keys.length)
        } else {
            RequestItems[tableName].Keys = []
        }
    } while (RequestItems[tableName].Keys.length)
    return segments
}

const singleBatchGet = async <Entity, KeySchema> (
    tableName: string,
    batchGetInput: DynamoDB.BatchGetItemInput,
    dynamoPromise: DynamoToPromise,
) => {
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

export async function batchGet<
    Entity, KeySchema
>(
    tableName: string, batchGetInput: DynamoDB.BatchGetItemInput, dynamoPromise: DynamoToPromise,
): Promise<BatchGetResult<Entity, KeySchema>> {
    const segmentedBatchGetInputs = segmentBatchGetInputs(batchGetInput)
    const batchGets = segmentedBatchGetInputs.map( (segment) => singleBatchGet<Entity, KeySchema>(
        tableName, segment, dynamoPromise,
    ))
    const partialResults = await Promise.all(batchGets)
    const result = partialResults.reduce((acc, current) => {
        acc.data = acc.data.concat(current.data)
        return acc
    }, { data: []})
    return result
}
