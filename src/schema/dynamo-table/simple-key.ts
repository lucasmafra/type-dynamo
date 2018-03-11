import { TableSchema } from '../'
import { DynamoGet, DynamoScan } from '../../chaining/find'
import { DynamoEntityWithSimpleKey } from '../dynamo-entity'

export class DynamoTableWithSimpleKey<Table, PartitionKey> extends DynamoEntityWithSimpleKey<
    Table, PartitionKey
> {

    private mockData: Table[]

    constructor(
        tableSchema: TableSchema,
    ) {
        super({
            tableName: tableSchema.tableName,
            tableSchema,
        })
    }

    public find(): DynamoScan<Table, PartitionKey>

    public find(keys: PartitionKey[]): DynamoBatchGet<Table, PartitionKey>

    public find(key: PartitionKey): DynamoGet<Table, PartitionKey>

    public find(args?: any): any {
        if (!args) {
            return new DynamoScan<Table, PartitionKey>(this._entitySchema)
        }
        if (args.length) {
            return new DynamoBatchGet<Table, PartitionKey>(this._entitySchema, args)
        }
        return new DynamoGet<Table, PartitionKey>(
            { schema: this._entitySchema, key: args },
        )
    }

    public save() {
        // TODO
    }

    public update() {
        // TODO
    }

    public delete() {
        // TODO
    }

    public mock(data: Table[]) {
        this.mockData = data
    }

}
