import {  } from '../src'
import { DynamoTableWithSimpleKey } from '../src/schema/dynamo-table'
import { typeDynamo } from './database.config'
import { EntityType } from './Feed'

export const PARAMS_ID = '0'

export type EntityGroup = { [P in EntityType]: string }

export class FeedParams {
    public id = PARAMS_ID // only row in the table
    public latestGeneralGroup: string
    public latestEntityGroup: EntityGroup
    public oldestGeneralGroup: string
    public oldestEntityGroup: EntityGroup
}

export const FeedParamsRepo = typeDynamo
    .defineTable(FeedParams, {
        tableName: `FeedParamsLocal`,
        partitionKey: 'id',
    })
    .getInstance()
