import { BatchGetChaining } from '../../chaining/batch-get-chaining'
import { GetChaining } from '../../chaining/get-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { IOperations } from '../../types'

export class DynamoTableWithSimpleKey<Model, PartitionKey> {
  constructor(
    private tableName: string, private operations: IOperations,
  ) { }

  public find(): ScanChaining<Model, PartitionKey>
  public find(keys: PartitionKey[]): BatchGetChaining<Model, PartitionKey>
  public find(key: PartitionKey): GetChaining<Model, PartitionKey>

  public find(args?: any): any {
    const { tableName } = this
    const { scan, get, batchGet } = this.operations

    if (!args) {
      return new ScanChaining(scan, { tableName })
    }
    if (args.constructor === Array && args.length) {
      return new BatchGetChaining(batchGet, { tableName, keys: args })
    }
    return new GetChaining(get, { tableName, key: args })
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
  // public update(key: PartitionKey, item: ExplicitKeyItemType<Model, PartitionKey>):
  //   DynamoUpdate<Model, PartitionKey>
  //
  // public update(item: ImplicityKeyItemType<Model, PartitionKey>):
  //   DynamoUpdate<Model, PartitionKey>
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
  // public delete(key: PartitionKey): DynamoDelete<Model, PartitionKey>
  // public delete(keys: PartitionKey[]): DynamoBatchDelete<PartitionKey>
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
