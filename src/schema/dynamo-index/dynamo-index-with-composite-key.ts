import { QueryChaining } from '../../chaining/find/query'
import { ScanChaining } from '../../chaining/find/scan/scan'
import DynamoClient from '../../operations/dynamo-client'
import { IHelpers, IIndexSchema, IOperations } from '../../types'

export class DynamoIndexWithCompositeKey<Index, PartitionKey, SortKey,
  KeySchema> {
  constructor(
    private indexSchema: IIndexSchema,
    private operations: IOperations,
  ) { }

  public find(): ScanChaining<Index, KeySchema>

  public find(partitionKey: PartitionKey): QueryChaining<
    Index, PartitionKey, SortKey, KeySchema>

  public find(args?: any): any {
    if (!args) {
      return new ScanChaining<Index, KeySchema>(
        this.operations,
        { tableName: this.indexSchema.tableName,
          indexName: this.indexSchema.indexName },
      )
    }
    return new QueryChaining<Index, PartitionKey, SortKey, KeySchema>(
      this.dynamoClient, this.helpers,
      { tableName: this.indexSchema.tableName,
        indexName: this.indexSchema.indexName, partitionKey: args },
    )
  }
}
