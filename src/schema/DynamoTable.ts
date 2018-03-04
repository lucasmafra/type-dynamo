import { scan as Scan, ScanResult } from '../databaseOperations/scan'
import { TableSchema } from './'
import { DynamoEntity } from './DynamoEntity'

class DynamoTable<Table, KeySchema> extends DynamoEntity<Table, KeySchema> {

    constructor(
        tableSchema: TableSchema,
    ) {
        super({
            tableName: tableSchema.tableName,
            tableSchema,
        })
    }

    public putItem() {
        return Scan<Table, KeySchema>((this as any)._entitySchema)
    }

    public getItem() {
        return Scan<Table, KeySchema>((this as any)._entitySchema) // TODO GET ITEM
    }

    public batchGet() {
        return Scan<Table, KeySchema>((this as any)._entitySchema) // TODO BATCH GET
    }

    public batchWrite() {
        return Scan<Table, KeySchema>((this as any)._entitySchema) // // TODO BATCH WRITE
    }

}

export default DynamoTable
