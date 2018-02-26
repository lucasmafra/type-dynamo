import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../schema'
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

function buildScanInput(entitySchema: EntitySchema): DynamoDB.ScanInput {
    const input: DynamoDB.ScanInput = {
        TableName: entitySchema.tableName,
    }
    if (entitySchema.indexSchema) {
        input.IndexName = entitySchema.indexSchema.indexName
    }
    return input
}

export async function scan<
    Entity, KeySchema
>(entitySchema: EntitySchema): Promise<ScanResult<Entity, KeySchema>> {
    const scanInput = buildScanInput(entitySchema)
    const scanOutput = await dynamoPromise.scan(scanInput)
    const result: ScanResult<Entity, KeySchema> = {
        data: scanOutput.Items as any,
        lastKey: scanOutput.LastEvaluatedKey as any,
    }
    return result
}
