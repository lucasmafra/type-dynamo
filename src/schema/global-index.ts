import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from './dynamo-index'

export function globalIndex< // partitionKey; keysOnly
    Table,
    TableSchema,
    IndexName extends string,
    PartitionKey extends keyof Table
    >(
        table: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'KEYS_ONLY',
        partitionKey: PartitionKey,
    },
): { [P in IndexName]: DynamoIndexWithSimpleKey<
    Pick<Table, PartitionKey> & TableSchema,
    Pick<Table, PartitionKey>> }

export function globalIndex< // partitionKey and sortKey; keysOnly
    Table,
    TableSchema,
    IndexName extends string,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table
    >(
        table: {new(): Table }, config: {
            indexName: IndexName,
            projectionType: 'KEYS_ONLY',
            partitionKey: PartitionKey,
            sortKey: SortKey,
        },
): {
    [P in IndexName]: DynamoIndexWithCompositeKey<
        Pick<Table, PartitionKey & SortKey> & TableSchema, Pick<Table, PartitionKey>, Pick<Table, SortKey>
    >
}

export function globalIndex< // partitionKey; ALL
    Table,
    TableSchema,
    IndexName extends string,
    PartitionKey extends keyof Table
    >(
        Class: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'ALL',
        partitionKey: PartitionKey,
    },
): { [P in IndexName]: DynamoIndexWithSimpleKey<Table, Pick<Table, PartitionKey>> }

export function globalIndex< // partitionKey and sortKey; ALL
    Table,
    TableSchema,
    IndexName extends string,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table
    >(
        Class: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'ALL',
        partitionKey: PartitionKey,
        sortKey: SortKey,
    },
): { [P in IndexName]: DynamoIndexWithCompositeKey<
        Table, Pick<Table, PartitionKey>, Pick<Table, SortKey>
    > }

export function globalIndex< // partitionKey; INCLUDE
    Table,
    TableSchema,
    IndexName extends string,
    PartitionKey extends keyof Table,
    ProjectionAttributes extends keyof Table
>(
    Class: {new(): Table }, config: {
    indexName: IndexName,
    projectionType: 'INCLUDE',
    attributes: ProjectionAttributes[]
    partitionKey: PartitionKey,
},
): { [P in IndexName]: DynamoIndexWithSimpleKey<
    Pick<Table, PartitionKey | ProjectionAttributes> & TableSchema,
    Pick<Table, PartitionKey>
> }

export function globalIndex< // partitionKey and sortKey; INCLUDE
    Table,
    TableSchema,
    IndexName extends string,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table,
    ProjectionAttributes extends keyof Table
>(
    Class: {new(): Table }, config: {
    indexName: IndexName,
    projectionType: 'INCLUDE',
    attributes: ProjectionAttributes[]
    partitionKey: PartitionKey,
    sortKey: SortKey,
},
    ): { [P in IndexName]: DynamoIndexWithCompositeKey<
    Pick<Table, PartitionKey | SortKey | ProjectionAttributes> & TableSchema,
    Pick<Table, PartitionKey>,
    Pick<Table, SortKey>
> }

export function globalIndex(constructor: any, config: any) {
    if (config.sortKey) {
        return { [config.indexName] : new DynamoIndexWithCompositeKey(config) }
    }
    return { [config.indexName] : new DynamoIndexWithSimpleKey(config) }
}
