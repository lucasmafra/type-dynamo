import DynamoIndex from './DynamoIndex'

export function globalIndex< // partitionKey; keysOnly
    Table,
    IndexName extends string,
    PartitionKey extends keyof Table
    >(
        table: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'KEYS_ONLY',
        partitionKey: PartitionKey,
    },
): { [P in IndexName]: DynamoIndex<Pick<Table, PartitionKey>, Pick<Table, PartitionKey>, undefined> }

export function globalIndex< // partitionKey and sortKey; keysOnly
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
    [P in IndexName]: DynamoIndex<Pick<Table, PartitionKey & SortKey>, Pick<Table, PartitionKey>, Pick<Table, SortKey>>
}

export function globalIndex< // partitionKey; ALL
    Table,
    IndexName extends string,
    PartitionKey extends keyof Table
    >(
        Class: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'ALL',
        partitionKey: PartitionKey,
    },
): { [P in IndexName]: DynamoIndex<Table, Pick<Table, PartitionKey>, undefined> }

export function globalIndex< // partitionKey and sortKey; ALL
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
): { [P in IndexName]: DynamoIndex<Table, Pick<Table, PartitionKey>, Pick<Table, SortKey>> }

export function globalIndex< // partitionKey; INCLUDE
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
): { [P in IndexName]: DynamoIndex<
    Pick<Table, PartitionKey | ProjectionAttributes>,
    Pick<Table, PartitionKey>,
    undefined
> }

export function globalIndex< // partitionKey and sortKey; INCLUDE
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
    ): { [P in IndexName]: DynamoIndex<
    Pick<Table, PartitionKey | SortKey | ProjectionAttributes>,
    Pick<Table, PartitionKey>,
    Pick<Table, SortKey>
> }

export function globalIndex(constructor: any, config: any) {
    return { [config.indexName] : new DynamoIndex(config) }
}
