import { BatchGetChaining } from '../../chaining/batch-get-chaining'
import { GetChaining } from '../../chaining/get-chaining'
import { QueryChaining } from '../../chaining/query-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { IOperations } from '../../types'

export class DynamoTableWithCompositeKey<Model, PartitionKey, SortKey> {
  constructor(
    private tableName: string, private operations: IOperations,
  ) { }

  public find(): ScanChaining<Model, PartitionKey & SortKey>

  public find(keys: Array<PartitionKey & SortKey>): BatchGetChaining<
    Model, PartitionKey & SortKey>

  public find(key: PartitionKey & SortKey): GetChaining<
    Model, PartitionKey & SortKey>

  public find(partitionKey: PartitionKey): QueryChaining<
    Model, PartitionKey, SortKey, PartitionKey & SortKey>

  public find(args?: any): any {
    const { tableName } = this
    const { scan, batchGet, get, query } = this.operations

    if (!args) {
      return new ScanChaining(scan, { tableName })
    }
    if (args.constructor === Array) {
      return new BatchGetChaining(batchGet, { tableName, keys: args  })
    }
    if (Object.keys(args).length === 2) {
      return new GetChaining(get, { tableName, key: args })
    }
    return new QueryChaining(query, { tableName, partitionKey: args })
  }

  // public save(item: Model): DynamoPut<Model>
  // public save(items: Model[]): DynamoBatchWrite<Model>
  //
  // public save(args: any) {
  //   if (args.constructor !== Array) {
  //     return new DynamoPut<Model>({
  //       schema: this._entitySchema,
  //       item: args,
  //     })
  //   }
  //   if (args.length) {
  //     return new DynamoBatchWrite<Model>({
  //       schema: this._entitySchema,
  //       items: args,
  //     })
  //   } else {
  //     throw new Error('BatchWriteWithNoItems')
  //   }
  // }
  //
  // public update(key: PartitionKey & SortKey, item: ExplicitKeyItemType<Model, PartitionKey & SortKey>):
  //   DynamoUpdate<Model, PartitionKey & SortKey>
  // public update(item: ImplicityKeyItemType<Model, PartitionKey & SortKey>):
  //   DynamoUpdate<Model, PartitionKey & SortKey>
  //
  // public update(...args: any[]) {
  //   if (args.length === 2) {
  //     return new DynamoUpdate({
  //       schema: this._entitySchema,
  //       key: args[0],
  //       item: args[1],
  //     } as any)
  //   } else {
  //     return new DynamoUpdate({
  //       schema: this._entitySchema,
  //       item: args[0],
  //     })
  //   }
  // }
  //
  // public delete(key: PartitionKey & SortKey): DynamoDelete<Model, PartitionKey & SortKey>
  // public delete(keys: Array<PartitionKey & SortKey>): DynamoBatchDelete<PartitionKey & SortKey>
  // public delete(args: any) {
  //   if (args.constructor !== Array) {
  //     return new DynamoDelete({
  //       schema: this._entitySchema,
  //       key: args,
  //     })
  //   } else {
  //     if (!args.length) {
  //       throw new Error('BatchDeleteWithNoKeys')
  //     }
  //     return new DynamoBatchDelete({
  //       schema: this._entitySchema,
  //       keys: args,
  //     })
  //   }
  // }
}
