import { IndexSchema, TableSchema } from './'
import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from './dynamo-index'
import { DynamoORMWithCompositeKey, DynamoORMWithSimpleKey } from './dynamo-orm'
import { DynamoTableWithCompositeKey, DynamoTableWithSimpleKey } from './dynamo-table'

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
): DynamoTableWithSimpleKey<
    Table,
    Pick<Table, PartitionKey>
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
    ): DynamoTableWithCompositeKey<
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
): DynamoORMWithSimpleKey<
    Table,
    Pick<Table, PartitionKey>,
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
    ): DynamoORMWithCompositeKey<
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
): DynamoORMWithSimpleKey<
    Table,
    Pick<Table, PartitionKey>,
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
    ): DynamoORMWithCompositeKey<
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
    ): DynamoORMWithSimpleKey<
    Table,
    Pick<Table, PartitionKey>,
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
    ): DynamoORMWithCompositeKey<
    Table,
    Pick<Table, PartitionKey>,
    Pick<Table, SortKey>,
    GlobalIndexes,
    LocalIndexes
>

export function defineTable(constructor: any, schema: any) {
    const tableSchema = buildTableSchema(schema)
    if (schema.globalIndexes || schema.localIndexes) {
        if (tableSchema.sortKey) {
            return new DynamoORMWithCompositeKey(tableSchema, schema.globalIndexes, schema.localIndexes)
        }
        return new DynamoORMWithSimpleKey(tableSchema, schema.globalIndexes, schema.localIndexes)
    }
    if (tableSchema.sortKey) {
        return new DynamoTableWithCompositeKey(tableSchema)
    }
    return new DynamoTableWithSimpleKey(tableSchema)
}
