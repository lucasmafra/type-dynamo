import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'
import { buildExclusiveStartKey } from '../helpers'
type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>

const dynamoPromise = new DynamoToPromise(new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
}))

export interface QueryResult<TableModel, KeySchema> {
    data: TableModel[]
    lastKey?: KeySchema
}

export async function queryPaginate<
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
    >(queryInput: DynamoDB.QueryInput): Promise<Omit<QueryResult<Entity, KeySchema>, 'lastKey'>> {
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
