import { DynamoDB } from 'aws-sdk'
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
