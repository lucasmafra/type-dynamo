import DynamoPromise from '../../../../database-operations/dynamo-to-promise'
import { TableSchema } from '../../../../schema'
import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from '../../../../schema/dynamo-index'
import { DynamoTableWithCompositeKey } from '../../../../schema/dynamo-table'
import { CompositeKeyWithGlobalIndex } from './with-global-index'

export class TypeDynamoDefineTableCompositeKey<
    Table,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table
> {

    private dynamoPromise: DynamoPromise
    private tableSchema: TableSchema

    constructor(dynamoPromise: DynamoPromise, schema: {
        tableName: string,
        partitionKey: PartitionKey,
        sortKey: SortKey,
    }) {
        this.dynamoPromise = dynamoPromise
        this.tableSchema = this.buildTableSchema(schema)
    }

    public getInstance(): DynamoTableWithCompositeKey<
        Table,
        Pick<Table, PartitionKey>,
        Pick<Table, SortKey>
    > {
        return new DynamoTableWithCompositeKey(
            this.tableSchema, this.dynamoPromise,
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
    ): CompositeKeyWithGlobalIndex <
    Table, PartitionKey, SortKey, {} & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Pick<Table, IndexPartitionKey> & Pick<Table, PartitionKey | SortKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey>
    > }, {}>

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
    ): CompositeKeyWithGlobalIndex <
    Table, PartitionKey, SortKey, {} & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Pick<Table, IndexPartitionKey | IndexSortKey> & Pick<Table, PartitionKey | SortKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
    > }, {}>

    public withGlobalIndex< // partitionKey; all
        IndexName extends string,
        IndexPartitionKey extends keyof Table
        >(
            config: {
            indexName: IndexName,
            projectionType: 'ALL',
            partitionKey: IndexPartitionKey,
        },
    ): CompositeKeyWithGlobalIndex <
    Table, PartitionKey, SortKey, {} & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Table,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey>
    > }, {}>

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
    ): CompositeKeyWithGlobalIndex <
    Table, PartitionKey, SortKey, {} & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Table,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
    > }, {}>

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
    ): CompositeKeyWithGlobalIndex <
    Table, PartitionKey, SortKey, {} & { [P in IndexName]: DynamoIndexWithSimpleKey<
        Pick<Table, IndexPartitionKey | IndexAttributes> & Pick<Table, PartitionKey | SortKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey>
    > }, {}>

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
    ): CompositeKeyWithGlobalIndex <
    Table, PartitionKey, SortKey, {} & { [P in IndexName]: DynamoIndexWithCompositeKey<
        Pick<Table, IndexPartitionKey | IndexSortKey | IndexAttributes> & Pick<Table, PartitionKey | SortKey>,
        Pick<Table, IndexPartitionKey>,
        Pick<Table, IndexSortKey>,
        Pick<Table, PartitionKey | SortKey> & Pick<Table, IndexPartitionKey | IndexSortKey>
    > }, {}>

    public withGlobalIndex(config: any) {
        if (config.sortKey) {
            return new CompositeKeyWithGlobalIndex(
                this.dynamoPromise,
                this.tableSchema,
                { [config.indexName] : new DynamoIndexWithCompositeKey(config) },
                {},
            )
        }
        return new CompositeKeyWithGlobalIndex(
            this.dynamoPromise,
            this.tableSchema,
            { [config.indexName] : new DynamoIndexWithSimpleKey(config) },
            { },
        )
    }

    private buildTableSchema(schema: any): TableSchema {
        const tableSchema: TableSchema = {
            tableName: schema.tableName,
            partitionKey: schema.partitionKey,
            writeCapacity: schema.writeCapacity || 1,
            readCapacity: schema.readCapacity || 1,
        }
        return tableSchema
    }

}
