import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from '../src/schema/dynamo-index'
import { DynamoORMWithCompositeKey } from '../src/schema/dynamo-orm'
import { DynamoTableWithCompositeKey } from '../src/schema/dynamo-table'
import { typeDynamo } from './database.config'

export type ActionType = 'update' | 'insert'
export type EntityType = 'technology' | 'user' | 'attachment' | 'project' | 'organization'
export type FeedKey = Pick<FeedTable, 'generalGroup' | 'timestamp'>
export type EntityIndexKey = Pick<FeedTable, 'entityGroup' | 'timestamp' | 'generalGroup'>
export type AuthorIndexKey = Pick<FeedTable, 'authorId' | 'timestamp' | 'generalGroup'>

export class FeedTable {
    // feed items grouped by timestamp
    public generalGroup: string
    // feed items of a certain entity group by timestamp
    public entityGroup: string
    public action: ActionType
    public subjectEntity: EntityType
    public subjectId: string
    public subjectTitle: string
    public authorName: string
    public authorId: string
    public timestamp: number // timestamp in ms
}

export const FeedRepo = typeDynamo
    .defineTable(FeedTable, {
        tableName: `FeedLocal`,
        partitionKey: 'generalGroup',
        sortKey: 'timestamp',
    })
    .withGlobalIndex({
        indexName: 'entityIndex',
        partitionKey: 'entityGroup',
        sortKey: 'timestamp',
        projectionType: 'ALL',
    })
    .withGlobalIndex({
        indexName: 'authorIndex',
        partitionKey: 'authorId',
        sortKey: 'timestamp',
        projectionType: 'ALL',
    })
    .getInstance()
