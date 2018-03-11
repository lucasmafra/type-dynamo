import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'
import { buildExclusiveStartKey } from '../helpers'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>

export interface ScanResult<TableModel, KeySchema> {
    data: TableModel[]
    lastKey?: KeySchema
}

export async function scanPaginate<
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
>(scanInput: DynamoDB.ScanInput): Promise<Omit<ScanResult<Entity, KeySchema>, 'lastKey'>> {
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
