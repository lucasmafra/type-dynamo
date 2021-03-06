import { TableSchema } from '../'
import { DynamoBatchDelete, DynamoDelete } from '../../chaining/delete'
import { DynamoBatchGet, DynamoGet, DynamoQuery, DynamoScan } from '../../chaining/find'
import { DynamoBatchWrite, DynamoPut } from '../../chaining/save'
import { DynamoUpdate, ExplicitKeyItemType, ImplicityKeyItemType } from '../../chaining/update'
import DynamoPromise from '../../database-operations/dynamo-to-promise'
import { DynamoEntityWithCompositeKey } from '../dynamo-entity'

export class DynamoTableWithCompositeKey<Table, PartitionKey, SortKey> extends DynamoEntityWithCompositeKey<
    Table, PartitionKey, SortKey, PartitionKey & SortKey
> {

    private mockData: Table[]

    constructor(
        tableSchema: TableSchema,
        dynamoPromise: DynamoPromise,
    ) {
        super({
            tableName: tableSchema.tableName,
            tableSchema,
            dynamoPromise,
        })
    }

    public find(): DynamoScan<Table, PartitionKey & SortKey>
    public find(keys: Array<PartitionKey & SortKey>): DynamoBatchGet<Table, PartitionKey & SortKey>
    public find(key: PartitionKey & SortKey): DynamoGet<Table, PartitionKey & SortKey>
    public find(partitionKey: PartitionKey): DynamoQuery<Table, PartitionKey, SortKey, PartitionKey & SortKey>

    public find(args?: any): any {
        if (!args) {
            return new DynamoScan<Table, PartitionKey & SortKey>(this._entitySchema)
        }
        if (args.constructor === Array && args.length) {
            return new DynamoBatchGet<Table, PartitionKey & SortKey>({
                schema: this._entitySchema, keys: args,
            })
        }
        if (args.constructor === Array && args.length === 0) { // call batch get without key
            throw new Error('BatchGetWithNoKeys')
        }
        if (Object.keys(args).length === 2) {
            return new DynamoGet<Table, PartitionKey & SortKey>(
                { schema: this._entitySchema, key: args },
            )
        } else {
            return new DynamoQuery<Table, PartitionKey, SortKey, PartitionKey & SortKey>({
                schema: this._entitySchema, partitionKey: args,
            })
        }
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

    public update(key: PartitionKey & SortKey, item: ExplicitKeyItemType<Table, PartitionKey & SortKey>):
        DynamoUpdate<Table, PartitionKey & SortKey>
    public update(item: ImplicityKeyItemType<Table, PartitionKey & SortKey>):
        DynamoUpdate<Table, PartitionKey & SortKey>

    public update(...args: any[]) {
        if (args.length === 2) {
            return new DynamoUpdate({
                schema: this._entitySchema,
                key: args[0],
                item: args[1],
            } as any)
        } else {
            return new DynamoUpdate({
                schema: this._entitySchema,
                item: args[0],
            })
        }
    }

    public delete(key: PartitionKey & SortKey): DynamoDelete<Table, PartitionKey & SortKey>
    public delete(keys: Array<PartitionKey & SortKey>): DynamoBatchDelete<PartitionKey & SortKey>
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
