import DynamoClient from '../../operations/dynamo-client'
import { IHelpers, ITableSchema } from '../../types/index'
import {
  DynamoTableWithCompositeKey,
} from './dynamo-table-with-composite-key'

export class DynamoTableWithCompositeKeyAndIndexes<
  Model, PartitionKey, SortKey, GlobalIndexes, LocalIndexes
  > extends DynamoTableWithCompositeKey<Model, PartitionKey, SortKey> {
  public onIndex: GlobalIndexes & LocalIndexes
  private globalIndexes: GlobalIndexes
  private localIndexes: LocalIndexes

  constructor(
    tableSchema: ITableSchema,
    globalIndexes: GlobalIndexes,
    localIndexes: LocalIndexes,
    dynamoClient: DynamoClient,
    helpers: IHelpers,
  ) {
    super(tableSchema, dynamoClient, helpers)
    this.globalIndexes = globalIndexes
    this.localIndexes = localIndexes
    this.onIndex = Object.assign({}, this.globalIndexes, this.localIndexes)
  }
}
