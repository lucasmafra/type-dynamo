import { DynamoDB } from 'aws-sdk'
import { buildExclusiveStartKey } from '../schema/chaining/scan/paginate'
import { DynamoEntity } from '../schema/DynamoEntity'
import DynamoToPromise from './dynamoToPromise'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface ScanResult<TableModel, KeySchema> {
    data: TableModel[]
    lastKey?: KeySchema
}

export async function scan<
    Entity, KeySchema
>(scanInput: DynamoDB.ScanInput): Promise<ScanResult<Entity, KeySchema>> {
    const scanOutput = await dynamoPromise.scan(scanInput)
    const result: ScanResult<Entity, KeySchema> = {
        data: scanOutput.Items as any,
        lastKey: scanOutput.LastEvaluatedKey as any,
    }
    return result
}

export async function scanAllResults<
    Entity, KeySchema
>(scanInput: DynamoDB.ScanInput): Promise<ScanResult<Entity, KeySchema>> {
    let lastKey
    const result: ScanResult<Entity, KeySchema> = {} as any
    do {
        const scanOutput = await dynamoPromise.scan(scanInput)
        if (!result.data) {
            result.data = new Array<Entity>()
        }
        result.data = result.data.concat(scanOutput.Items as any)
        lastKey = scanOutput.LastEvaluatedKey
        if (lastKey) {
            scanInput.ExclusiveStartKey = buildExclusiveStartKey(lastKey)
        }
    } while (lastKey)
    return result
}
