import { IndexSchema, KeySchema, TableSchema } from './'
import DynamoIndex from './DynamoIndex'
import DynamoORM from './DynamoORM'
import DynamoTable from './DynamoTable'

function buildTableSchema(schema: any): TableSchema {
    const tableSchema: TableSchema = {
        tableName: schema.tableName,
        keySchema: schema.keySchema,
        writeCapacity: schema.writeCapacity || 1,
        readCapacity: schema.readCapacity || 1,
    }
    return tableSchema
}

export function defineTable<
    Table,
    TableKeySchema extends keyof Table
>(
    table: {new(): Table },
    schema: {
        tableName: string,
        keySchema: TableKeySchema,
    },
): DynamoTable<
    Table,
    Pick<Table, TableKeySchema>
>
export function defineTable<
    Table,
    TableKeySchema extends keyof Table,
    GlobalIndexes
>(
    table: {new(): Table },
    schema: {
        tableName: string,
        keySchema: TableKeySchema,
        globalIndexes: GlobalIndexes,
    },
): DynamoORM<
    Table,
    Pick<Table, TableKeySchema>,
    GlobalIndexes,
    undefined
>

export function defineTable<
    Table,
    TableKeySchema extends keyof Table,
    LocalIndexes
    >(
    table: {new(): Table },
    schema: {
        tableName: string,
        keySchema: TableKeySchema,
        localIndexes: LocalIndexes,
    },
): DynamoORM<
    Table,
    Pick<Table, TableKeySchema>,
    undefined,
    LocalIndexes
>

export function defineTable<
    Table,
    TableKeySchema extends keyof Table,
    GlobalIndexes,
    LocalIndexes
    >(
    table: {new(): Table },
    schema: {
        tableName: string,
        keySchema: TableKeySchema,
        globalIndexes: GlobalIndexes,
        localIndexes: LocalIndexes,
    },
    ): DynamoORM<
    Table,
    Pick<Table, TableKeySchema>,
    GlobalIndexes,
    LocalIndexes
>

export function defineTable(constructor: any, schema: any) {
    const tableSchema = buildTableSchema(schema)
    return new DynamoORM(tableSchema, schema.globalIndexes, schema.localIndexes)
}
