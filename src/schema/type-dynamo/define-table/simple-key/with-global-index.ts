import DynamoClient from '../../../../operations/dynamo-client'
import { TableSchema } from '../../../../schema'
import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from '../../../../schema/dynamo-index'
import { DynamoORMWithSimpleKey } from '../../../../schema/dynamo-orm'

export class SimpleKeyWithGlobalIndex<
    Table,
    PartitionKey extends keyof Table,
    CurrentGlobalIndexes,
    CurrentLocalIndexes
> {

    private dynamoClient: DynamoClient
    private tableSchema: TableSchema
    private currentGlobalIndexes: CurrentGlobalIndexes
    private currentLocalIndexes: CurrentLocalIndexes

    constructor(
        dynamoClient: DynamoClient,
        tableSchema: TableSchema,
        currentGlobalIndexes: CurrentGlobalIndexes,
        currentLocalIndexes: CurrentLocalIndexes,
    ) {
        this.dynamoClient = dynamoClient
        this.tableSchema = tableSchema
        this.currentGlobalIndexes = currentGlobalIndexes
        this.currentLocalIndexes = currentLocalIndexes
    }
    public getInstance(): DynamoORMWithSimpleKey<
        Table,
        Pick<Table, PartitionKey>,
        CurrentGlobalIndexes,
        CurrentLocalIndexes
    > {
        return new DynamoORMWithSimpleKey(
            this.tableSchema,
            this.currentGlobalIndexes,
            this.currentLocalIndexes,
            this.dynamoClient,
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
    ): SimpleKeyWithGlobalIndex<
    Table, PartitionKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Pick<Table, IndexPartitionKey> & Pick<Table, PartitionKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey> & Pick<Table, IndexPartitionKey>
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
    ): SimpleKeyWithGlobalIndex<
    Table, PartitionKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Pick<Table, IndexPartitionKey | IndexSortKey> & Pick<Table, PartitionKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
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
    ): SimpleKeyWithGlobalIndex<
    Table, PartitionKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Table,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey> & Pick<Table, IndexPartitionKey>
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
    ): SimpleKeyWithGlobalIndex<
    Table, PartitionKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Table,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
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
    ): SimpleKeyWithGlobalIndex<
    Table, PartitionKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Pick<Table, IndexPartitionKey | IndexAttributes> & Pick<Table, PartitionKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey> & Pick<Table, IndexPartitionKey>
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
    ): SimpleKeyWithGlobalIndex<
    Table, PartitionKey, CurrentGlobalIndexes & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Pick<Table, IndexPartitionKey | IndexSortKey | IndexAttributes> & Pick<Table, PartitionKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
    > }, CurrentLocalIndexes>

    public withGlobalIndex(config: any) {
        if (config.sortKey) {
            this.currentGlobalIndexes = {
                ...this.currentGlobalIndexes as any,
                [config.indexName] : new DynamoIndexWithCompositeKey(config),
            }
            return new SimpleKeyWithGlobalIndex(
                this.dynamoClient,
                this.tableSchema,
                this.currentGlobalIndexes,
                this.currentLocalIndexes,
            )
        }
        this.currentGlobalIndexes = {
            ...this.currentGlobalIndexes as any,
            [config.indexName] : new DynamoIndexWithSimpleKey(config),
        }
        return new SimpleKeyWithGlobalIndex(
            this.dynamoClient,
            this.tableSchema,
            this.currentGlobalIndexes,
            this.currentLocalIndexes,
        )
    }

}
