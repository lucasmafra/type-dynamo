import { IndexSchema, TableSchema } from './'
import DynamoIndex from './DynamoIndex'
import DynamoORM from './DynamoORM'
import DynamoTable from './DynamoTable'

function buildTableSchema(schema: any): TableSchema {
    const tableSchema: TableSchema = {
        tableName: schema.tableName,
        partitionKey: schema.keySchema,
        sortKey: schema.sortKey,
        writeCapacity: schema.writeCapacity || 1,
        readCapacity: schema.readCapacity || 1,
    }
    return tableSchema
}

export function defineTable< // partitionKey; no index
    Table,
    PartitionKey extends keyof Table
>(
    table: {new(): Table },
    schema: {
        tableName: string,
        partitionKey: PartitionKey,
    },
): DynamoTable<
    Table,
    Pick<Table, PartitionKey>,
    undefined
>

export function defineTable< // partitionKey and sortKey; no index
    Table,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table
    >(
    table: {new(): Table },
    schema: {
        tableName: string,
        partitionKey: PartitionKey,
        sortKey: SortKey,
    },
    ): DynamoTable<
    Table,
    Pick<Table, PartitionKey>,
    Pick<Table, SortKey>
>

export function defineTable< // partitionKey; globalIndexes
    Table,
    PartitionKey extends keyof Table,
    GlobalIndexes
>(
    table: {new(): Table },
    schema: {
        tableName: string,
        partitionKey: PartitionKey,
        globalIndexes: GlobalIndexes,
    },
): DynamoORM<
    Table,
    Pick<Table, PartitionKey>,
    undefined,
    GlobalIndexes,
    undefined
>

export function defineTable< // partitionKey and sortKey; globalIndexes
    Table,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table,
    GlobalIndexes
    >(
    table: {new(): Table },
    schema: {
        tableName: string,
        partitionKey: PartitionKey,
        sortKey: SortKey,
        globalIndexes: GlobalIndexes,
    },
    ): DynamoORM<
    Table,
    Pick<Table, PartitionKey>,
    Pick<Table, SortKey>,
    GlobalIndexes,
    undefined
>

export function defineTable< // partitionKey; localIndexes
    Table,
    PartitionKey extends keyof Table,
    LocalIndexes
    >(
    table: {new(): Table },
    schema: {
        tableName: string,
        partitionKey: PartitionKey,
        localIndexes: LocalIndexes,
    },
): DynamoORM<
    Table,
    Pick<Table, PartitionKey>,
    undefined,
    undefined,
    LocalIndexes
>

export function defineTable< // partitionKey and sortKey; localIndexes
    Table,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table,
    LocalIndexes
    >(
    table: {new(): Table },
    schema: {
        tableName: string,
        partitionKey: PartitionKey,
        sortKey: PartitionKey,
        localIndexes: LocalIndexes,
    },
    ): DynamoORM<
    Table,
    Pick<Table, PartitionKey>,
    Pick<Table, SortKey>,
    undefined,
    LocalIndexes
>

export function defineTable< // partitionKey; globalIndex and localIndex
    Table,
    PartitionKey extends keyof Table,
    GlobalIndexes,
    LocalIndexes
    >(
    table: {new(): Table },
    schema: {
        tableName: string,
        partitionKey: PartitionKey,
        globalIndexes: GlobalIndexes,
        localIndexes: LocalIndexes,
    },
    ): DynamoORM<
    Table,
    Pick<Table, PartitionKey>,
    undefined,
    GlobalIndexes,
    LocalIndexes
>

export function defineTable< // partitionKey and sortKey; globalIndex and localIndex
    Table,
    PartitionKey extends keyof Table,
    SortKey extends keyof Table,
    GlobalIndexes,
    LocalIndexes
    >(
    table: {new(): Table },
    schema: {
        tableName: string,
        partitionKey: PartitionKey,
        sortKey: SortKey,
        globalIndexes: GlobalIndexes,
        localIndexes: LocalIndexes,
    },
    ): DynamoORM<
    Table,
    Pick<Table, PartitionKey>,
    Pick<Table, SortKey>,
    GlobalIndexes,
    LocalIndexes
>

export function defineTable(constructor: any, schema: any) {
    const tableSchema = buildTableSchema(schema)
    return new DynamoORM(tableSchema, schema.globalIndexes, schema.localIndexes)
}
