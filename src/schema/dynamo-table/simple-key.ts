import { TableSchema } from '../'
import { DynamoBatchDelete, DynamoDelete } from '../../chaining/delete'
import { DynamoBatchGet, DynamoGet, DynamoScan } from '../../chaining/find'
import { DynamoBatchWrite, DynamoPut } from '../../chaining/save'
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
        if (args.constructor === Array && args.length) {
            return new DynamoBatchGet<Table, PartitionKey>({
                schema: this._entitySchema, keys: args,
            })
        }
        if (args.constructor === Array && args.length === 0) { // call batch get without key
            throw new Error('BatchGetWithNoKeys')
        }
        return new DynamoGet<Table, PartitionKey>(
            { schema: this._entitySchema, key: args },
        )
    }

    public save(item: Table): DynamoPut<Table>
    public save(items: Table[]): DynamoBatchWrite<Table>

    public save(args: any) {
        if (args.constructor !== Array) {
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

    public delete(key: PartitionKey): DynamoDelete<Table, PartitionKey>
    public delete(keys: PartitionKey[]): DynamoBatchDelete<Table, PartitionKey>
    public delete(args: any) {
        if (args.constructor !== Array) {
            return new DynamoDelete({
                schema: this._entitySchema,
                key: args,
            })
        } else {
            if (!args.length) {
                throw new Error('BatchDeleteWithNoKeys')
            }
            return new DynamoBatchDelete({
                schema: this._entitySchema,
                keys: args,
            })
        }
    }

}
