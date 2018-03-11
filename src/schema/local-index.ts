import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from './dynamo-index'

export function localIndex< // partitionKey; keysOnly
    Table,
    IndexName extends string,
    PartitionKey extends keyof Table
    >(
        table: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'KEYS_ONLY',
        partitionKey: PartitionKey,
    },
): { [P in IndexName]: DynamoIndexWithSimpleKey<Pick<Table, PartitionKey>, Pick<Table, PartitionKey>> }

export function localIndex< // partitionKey and sortKey; keysOnly
    Table,
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
        Pick<Table, PartitionKey & SortKey>, Pick<Table, PartitionKey>, Pick<Table, SortKey>
    >
}

export function localIndex< // partitionKey; ALL
    Table,
    IndexName extends string,
    PartitionKey extends keyof Table
    >(
        Class: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'ALL',
        partitionKey: PartitionKey,
    },
): { [P in IndexName]: DynamoIndexWithSimpleKey<Table, Pick<Table, PartitionKey>> }

export function localIndex< // partitionKey and sortKey; ALL
    Table,
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
): { [P in IndexName]: DynamoIndexWithCompositeKey<Table, Pick<Table, PartitionKey>, Pick<Table, SortKey>> }

export function localIndex< // partitionKey; INCLUDE
    Table,
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
    Pick<Table, PartitionKey | ProjectionAttributes>,
    Pick<Table, PartitionKey>
> }

export function localIndex< // partitionKey and sortKey; INCLUDE
    Table,
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
    Pick<Table, PartitionKey | SortKey | ProjectionAttributes>,
    Pick<Table, PartitionKey>,
    Pick<Table, SortKey>
> }

export function localIndex(constructor: any, config: any) {
    if (config.sortKey) {
        return { [config.indexName] : new DynamoIndexWithCompositeKey(config) }
    }
    return { [config.indexName] : new DynamoIndexWithSimpleKey(config) }
}
