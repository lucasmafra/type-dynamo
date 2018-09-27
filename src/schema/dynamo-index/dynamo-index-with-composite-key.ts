import { DynamoQuery } from '../../chaining/find/query/query'
import { DynamoScan } from '../../chaining/find/scan/scan'
import DynamoClient from '../../operations/dynamo-client'
import { IHelpers, IIndexSchema } from '../../types'

export class DynamoIndexWithCompositeKey<Index, PartitionKey, SortKey,
  KeySchema> {
  private indexSchema: IIndexSchema
  private dynamoClient: DynamoClient
  private helpers: IHelpers

  constructor(
    indexSchema: IIndexSchema,
    dynamoClient: DynamoClient,
    helpers: IHelpers,
  ) {
    this.indexSchema = indexSchema
    this.dynamoClient = dynamoClient
    this.helpers = helpers
  }

  public find(): DynamoScan<Index, KeySchema>

  public find(partitionKey: PartitionKey): DynamoQuery<
    Index, PartitionKey, SortKey, KeySchema>

  public find(args?: any): any {
    if (!args) {
      return new DynamoScan<Index, KeySchema>(
        this.dynamoClient, this.helpers,
        { tableName: this.indexSchema.tableName,
          indexName: this.indexSchema.indexName },
      )
    }
    return new DynamoQuery<Index, PartitionKey, SortKey, KeySchema>(
      this.dynamoClient, this.helpers,
      { tableName: this.indexSchema.tableName,
        indexName: this.indexSchema.indexName, partitionKey: args },
    )
  }
}
