import { QueryChaining } from '../../chaining/query-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { IOperations, Omit } from '../../types'

export class DynamoIndexWithSimpleKey<Model, PartitionKey> {
  constructor(
    private tableName: string,
    private indexName: string,
    private operations: IOperations,
  ) { }

  public find(): ScanChaining<Model, PartitionKey>
  public find(partitionKey: PartitionKey): Omit<QueryChaining<Model,
    PartitionKey, {}, PartitionKey>, 'withSortKeyCondition'>

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
