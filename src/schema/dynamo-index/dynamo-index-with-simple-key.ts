import { QueryChaining } from '../../chaining/query-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { IOperations, Omit } from '../../types'

export class DynamoIndexWithSimpleKey<Index, PartitionKey, KeySchema> {
  constructor(
    private tableName: string,
    private indexName: string,
    private operations: IOperations,
  ) { }

  public find(): ScanChaining<Index, KeySchema>
  public find(partitionKey: PartitionKey): Omit<
    QueryChaining<Index, PartitionKey, {}, KeySchema>, 'withSortKeyCondition'>

  public find(args?: any): any {
    const { tableName, indexName } = this
    const { scan, query } = this.operations

    if (!args) {
      return new ScanChaining(scan, { tableName, indexName })
    }
    return new QueryChaining(
      query, { tableName, indexName, partitionKey: args }
    )
  }
}
