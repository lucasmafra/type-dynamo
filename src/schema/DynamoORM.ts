import { IndexSchema, TableSchema } from './'
import DynamoIndex from './DynamoIndex'
import DynamoTable from './DynamoTable'

export default class DynamoORM<
    Table,
    TableKeySchema,
    GlobalIndexes,
    LocalIndexes
> extends DynamoTable<Table, TableKeySchema> {
    public onIndex: GlobalIndexes & LocalIndexes
    private globalIndexes: GlobalIndexes
    private localIndexes: LocalIndexes

    constructor(
        tableSchema: TableSchema,
        globalIndexes: GlobalIndexes,
        localIndexes: LocalIndexes,
    ) {
        super(tableSchema)
        this.globalIndexes = globalIndexes
        this.localIndexes = localIndexes
        this.onIndex = Object.assign({}, this.globalIndexes, this.localIndexes)
    }
}
