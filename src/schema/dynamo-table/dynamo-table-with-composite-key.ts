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
}
