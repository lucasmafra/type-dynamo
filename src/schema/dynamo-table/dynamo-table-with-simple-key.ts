import { BatchGetChaining } from '../../chaining/batch-get-chaining'
import { BatchWriteChaining } from '../../chaining/batch-write-chaining'
import { GetChaining } from '../../chaining/get-chaining'
import { PutChaining } from '../../chaining/put-chaining'
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
    if (args.constructor === Array) {
      return new BatchGetChaining(batchGet, { tableName, keys: args })
    }
    return new GetChaining(get, { tableName, key: args })
  }

  public save(item: Model): PutChaining<Model>
  public save(items: Model[]): BatchWriteChaining<Model>
  public save(args: any) {
    const { tableName, operations: { batchWrite, put } } = this
    if (args.constructor === Array) {
      return new BatchWriteChaining(batchWrite, { tableName, items: args })
    }
    return new PutChaining(put, { tableName, item: args })
  }
}
