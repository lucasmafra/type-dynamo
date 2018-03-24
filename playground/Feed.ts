import { globalIndex, withGlobalIndexes } from '../src'
import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from '../src/schema/dynamo-index'
import { DynamoORMWithCompositeKey } from '../src/schema/dynamo-orm'
import { DynamoTableWithCompositeKey } from '../src/schema/dynamo-table'
import { typeDynamo } from './database.config'

export type ActionType = 'update' | 'insert'
export type EntityType = 'technology' | 'user' | 'attachment' | 'project' | 'organization'
export type FeedKey = Pick<FeedTable, 'generalGroup' | 'timestamp'>
export type EntityIndexKey = Pick<FeedTable, 'entityGroup' | 'timestamp'>
export type AuthorIndexKey = Pick<FeedTable, 'authorId' | 'timestamp'>

class GlobalIndex<Table, PartitionKey, SortKey> {
    public table: DynamoTableWithCompositeKey<Table, PartitionKey, SortKey>

    constructor(table: DynamoTableWithCompositeKey<Table, PartitionKey, SortKey>) {
        this.table = table
    }

    public define< // partitionKey and sortKey; keysOnly
        TableSchema,
        IndexName extends string,
        IndexPartitionKey extends keyof Table,
        IndexSortKey extends keyof Table
    >(
        config: {
            indexName: IndexName,
            projectionType: 'KEYS_ONLY',
            partitionKey: PartitionKey,
            sortKey: SortKey,
        },
    ): {
        [P in IndexName]: DynamoIndexWithCompositeKey<
            Pick<Table, IndexPartitionKey & IndexSortKey> & TableSchema,
            Pick<Table, IndexPartitionKey>,
            Pick<Table, IndexSortKey>,
            TableSchema & Pick<Table, IndexPartitionKey> & Pick<Table, IndexSortKey>
        >
    } {
        return { [config.indexName] : new DynamoIndexWithCompositeKey(config as any) } as any
    }

}

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
    .define(FeedTable, {
        tableName: `FeedLocal`,
        partitionKey: 'generalGroup',
        sortKey: 'timestamp',
    })
    .withGlobalIndexes(
        globalIndex(FeedTable, {
            indexName: 'entityIndex',
            partitionKey: 'entityGroup',
            sortKey: 'timestamp',
            projectionType: 'ALL',
        }),
        globalIndex(FeedTable, {
            indexName: 'authorIndex',
            partitionKey: 'authorId',
            sortKey: 'timestamp',
            projectionType: 'ALL',
        }),
    )
    .execute()
