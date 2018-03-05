import { DynamoDB } from 'aws-sdk'
import { buildExclusiveStartKey } from '../schema/chaining/query/paginate'
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

export async function queryAllResults<
    Entity, KeySchema
    >(queryInput: DynamoDB.QueryInput): Promise<QueryResult<Entity, KeySchema>> {
    let lastKey
    const result: QueryResult<Entity, KeySchema> = {} as any
    do {
        const queryOutput = await dynamoPromise.query(queryInput)
        if (!result.data) {
            result.data = new Array<Entity>()
        }
        result.data = result.data.concat(queryOutput.Items as any)
        lastKey = queryOutput.LastEvaluatedKey
        if (lastKey) {
            queryInput.ExclusiveStartKey = buildExclusiveStartKey(lastKey)
        }
    } while (lastKey)
    return result
}
