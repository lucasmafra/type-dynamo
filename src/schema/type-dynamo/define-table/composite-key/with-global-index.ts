import DynamoPromise from '../../../../database-operations/dynamo-to-promise'
import { TableSchema } from '../../../../schema'
import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from '../../../../schema/dynamo-index'
import { DynamoORMWithCompositeKey } from '../../../../schema/dynamo-orm'

export class CompositeKeyWithGlobalIndex<
    Table,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table,
    CurrentGlobalIndexes,
    CurrentLocalIndexes
> {

    private dynamoPromise: DynamoPromise
    private tableSchema: TableSchema
    private currentGlobalIndexes: CurrentGlobalIndexes
    private currentLocalIndexes: CurrentLocalIndexes

    constructor(
        dynamoPromise: DynamoPromise,
        tableSchema: TableSchema,
        currentGlobalIndexes: CurrentGlobalIndexes,
        currentLocalIndexes: CurrentLocalIndexes,
    ) {
        this.dynamoPromise = dynamoPromise
        this.tableSchema = tableSchema
        this.currentGlobalIndexes = currentGlobalIndexes
        this.currentLocalIndexes = currentLocalIndexes
    }
    public getInstance(): DynamoORMWithCompositeKey<
        Table,
        Pick<Table, PartitionKey>,
        Pick<Table, SortKey>,
        CurrentGlobalIndexes,
        CurrentLocalIndexes
    > {
        return new DynamoORMWithCompositeKey(
            this.tableSchema,
            this.currentGlobalIndexes,
            this.currentLocalIndexes,
            this.dynamoPromise,
        )
    }

    public withGlobalIndex< // partitionKey; keys only
        IndexName extends string,
        IndexPartitionKey extends keyof Table
        >(
            config: {
            indexName: IndexName,
            projectionType: 'KEYS_ONLY',
            partitionKey: IndexPartitionKey,
        },
    ): CompositeKeyWithGlobalIndex<
    Table, PartitionKey, SortKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Pick<Table, IndexPartitionKey> & Pick<Table, PartitionKey | SortKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey>
    > }, CurrentLocalIndexes>

    public withGlobalIndex< // partitionKey and sortKey; keys only
        IndexName extends string,
        IndexPartitionKey extends keyof Table,
        IndexSortKey extends keyof Table
        >(
            config: {
            indexName: IndexName,
            projectionType: 'KEYS_ONLY',
            partitionKey: IndexPartitionKey,
            sortKey: IndexSortKey,
        },
    ): CompositeKeyWithGlobalIndex<
    Table, PartitionKey, SortKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Pick<Table, IndexPartitionKey | IndexSortKey> & Pick<Table, PartitionKey | SortKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
    > }, CurrentLocalIndexes>

    public withGlobalIndex< // partitionKey; all
        IndexName extends string,
        IndexPartitionKey extends keyof Table
        >(
            config: {
            indexName: IndexName,
            projectionType: 'ALL',
            partitionKey: IndexPartitionKey,
        },
    ): CompositeKeyWithGlobalIndex<
    Table, PartitionKey, SortKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Table,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey>
    > }, CurrentLocalIndexes>

    public withGlobalIndex< // partitionKey and sortKey; all
        IndexName extends string,
        IndexPartitionKey extends keyof Table,
        IndexSortKey extends keyof Table
        >(
            config: {
            indexName: IndexName,
            projectionType: 'ALL',
            partitionKey: IndexPartitionKey,
            sortKey: IndexSortKey,
        },
    ): CompositeKeyWithGlobalIndex<
    Table, PartitionKey, SortKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Table,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
    > }, CurrentLocalIndexes>

    public withGlobalIndex< // partitionKey; include
        IndexName extends string,
        IndexPartitionKey extends keyof Table,
        IndexAttributes extends keyof Table
        >(
            config: {
            indexName: IndexName,
            projectionType: 'INCLUDE',
            attributes: IndexAttributes[],
            partitionKey: IndexPartitionKey,
        },
    ): CompositeKeyWithGlobalIndex<
    Table, PartitionKey, SortKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Pick<Table, IndexPartitionKey | IndexAttributes> & Pick<Table, PartitionKey | SortKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey>
    > }, CurrentLocalIndexes>

    public withGlobalIndex< // partitionKey and sortKey; all
        IndexName extends string,
        IndexPartitionKey extends keyof Table,
        IndexSortKey extends keyof Table,
        IndexAttributes extends keyof Table
        >(
            config: {
            indexName: IndexName,
            projectionType: 'INCLUDE',
            attributes: IndexAttributes[],
            partitionKey: IndexPartitionKey,
            sortKey: IndexSortKey,
        },
    ): CompositeKeyWithGlobalIndex<
    Table, PartitionKey, SortKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Pick<Table, IndexPartitionKey | IndexSortKey | IndexAttributes> & Pick<Table, PartitionKey | SortKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
    > }, CurrentLocalIndexes>

    public withGlobalIndex(config: any) {
        if (config.sortKey) {
            this.currentGlobalIndexes = {
                ...this.currentGlobalIndexes as any,
                [config.indexName] : new DynamoIndexWithCompositeKey(config),
            }
            return new CompositeKeyWithGlobalIndex(
                this.dynamoPromise,
                this.tableSchema,
                this.currentGlobalIndexes,
                this.currentLocalIndexes,
            )
        }
        this.currentGlobalIndexes = {
            ...this.currentGlobalIndexes as any,
            [config.indexName] : new DynamoIndexWithSimpleKey(config),
        }
        return new CompositeKeyWithGlobalIndex(
            this.dynamoPromise,
            this.tableSchema,
            this.currentGlobalIndexes,
            this.currentLocalIndexes,
        )
    }

}
