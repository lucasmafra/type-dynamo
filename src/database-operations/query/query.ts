import { DynamoDB } from 'aws-sdk'
import { Omit } from '../../helpers'
import DynamoToPromise from '../dynamo-to-promise'
import { buildExclusiveStartKey } from '../helpers'

export interface QueryResult<TableModel, KeySchema> {
    data: TableModel[]
    lastKey?: KeySchema
}

export async function queryPaginate<
    Entity, KeySchema
>(queryInput: DynamoDB.QueryInput, dynamoPromise: DynamoToPromise): Promise<QueryResult<Entity, KeySchema>> {
    const queryOutput = await dynamoPromise.query(queryInput)
    const result: QueryResult<Entity, KeySchema> = {
        data: queryOutput.Items as any,
        lastKey: queryOutput.LastEvaluatedKey as any,
    }
    return result
}

export async function queryAllResults<
    Entity, KeySchema
    >(
        queryInput: DynamoDB.QueryInput, dynamoPromise: DynamoToPromise,
    ): Promise<Omit<QueryResult<Entity, KeySchema>, 'lastKey'>> {
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
