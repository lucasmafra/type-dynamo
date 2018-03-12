import { TableSchema } from '../'
import { DynamoBatchGet, DynamoGet, DynamoScan } from '../../chaining/find'
import { DynamoPut } from '../../chaining/save'
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
            return new DynamoBatchGet<Table, PartitionKey>({
                schema: this._entitySchema, keys: args,
            })
        }
        return new DynamoGet<Table, PartitionKey>(
            { schema: this._entitySchema, key: args },
        )
    }

    public save(item: Table): DynamoPut<Table>
    public save(items: Table[]): DynamoBatchWrite<Table[]>

    public save(args: any) {
        if (args.length === undefined) {
            return new DynamoPut<Table>({
                schema: this._entitySchema,
                item: args,
            })
        }
        if (args.length) {
            return new DynamoBatchWrite<Table>({
                schema: this._entitySchema,
                items: args,
            })
        } else {
            throw new Error('BatchWriteWithNoItems')
        }
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
