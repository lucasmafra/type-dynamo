import { QueryChaining } from '../../chaining/query-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { IOperations } from '../../types'

export class DynamoIndexWithCompositeKey<Model, PartitionKey, SortKey,
  KeySchema> {
  constructor(
    private tableName: string,
    private indexName: string,
    private operations: IOperations,
  ) { }

  public find(): ScanChaining<Model, KeySchema>

  public find(partitionKey: PartitionKey): QueryChaining<
    Model, PartitionKey, SortKey, KeySchema>

  public find(args?: any): any {
    const { tableName, indexName } = this
    const { scan, query } = this.operations
    if (!args) {
      return new ScanChaining(scan, { tableName, indexName })
    }
    return new QueryChaining(
      query, { tableName, indexName, partitionKey: args },
    )
  }
}
