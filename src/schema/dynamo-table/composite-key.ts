import { TableSchema } from '../'
import { DynamoBatchGet, DynamoGet, DynamoQuery, DynamoScan } from '../../chaining/find'
import { DynamoPut } from '../../chaining/save'
import { DynamoEntityWithCompositeKey } from '../dynamo-entity'

export class DynamoTableWithCompositeKey<Table, PartitionKey, SortKey> extends DynamoEntityWithCompositeKey<
    Table, PartitionKey, SortKey
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

    public find(): DynamoScan<Table, PartitionKey & SortKey>
    public find(keys: Array<PartitionKey & SortKey>): DynamoBatchGet<Table, PartitionKey & SortKey>
    public find(key: PartitionKey & SortKey): DynamoGet<Table, PartitionKey & SortKey>
    public find(partitionKey: PartitionKey): DynamoQuery<Table, PartitionKey, SortKey>

    public find(args?: any): any {
        if (!args) {
            return new DynamoScan<Table, PartitionKey & SortKey>(this._entitySchema)
        }
        if (args.length) {
            return new DynamoBatchGet<Table, PartitionKey & SortKey>({
                schema: this._entitySchema, keys: args,
            })
        }
        if (args.length === 0) { // call batch get without key
            throw new Error('BatchGetWithNoKeys')
        }
        if (Object.keys(args).length === 2) {
            return new DynamoGet<Table, PartitionKey & SortKey>(
                { schema: this._entitySchema, key: args },
            )
        } else {
            return new DynamoQuery<Table, PartitionKey, SortKey>({
                schema: this._entitySchema, partitionKey: args,
            })
        }
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
