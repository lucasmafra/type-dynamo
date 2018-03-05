import { DynamoDB } from 'aws-sdk'
import { DynamoEntity } from '../schema/DynamoEntity'
import DynamoToPromise from './dynamoToPromise'

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface QueryResult<TableModel, KeySchema> {
    data: TableModel[]
    lastKey?: KeySchema
}

export async function query<
    Entity, KeySchema
>(queryInput: DynamoDB.QueryInput): Promise<QueryResult<Entity, KeySchema>> {
    const queryOutput = await dynamoPromise.query(queryInput)
    const result: QueryResult<Entity, KeySchema> = {
        data: queryOutput.Items as any,
        lastKey: queryOutput.LastEvaluatedKey as any,
    }
    return result
}
