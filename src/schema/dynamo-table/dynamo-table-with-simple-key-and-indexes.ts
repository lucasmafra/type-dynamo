import DynamoClient from '../../operations/dynamo-client'
import { IHelpers, ITableSchema } from '../../types/index'
import {
  DynamoTableWithSimpleKey,
} from './dynamo-table-with-simple-key'

export class DynamoTableWithSimpleKeyAndIndexes<
  Model, PartitionKey, GlobalIndexes, LocalIndexes
> extends DynamoTableWithSimpleKey<Model, PartitionKey> {
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
