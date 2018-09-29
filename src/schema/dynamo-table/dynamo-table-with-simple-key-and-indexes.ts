import { IOperations } from '../../types'
import { DynamoTableWithSimpleKey } from './dynamo-table-with-simple-key'

export class DynamoTableWithSimpleKeyAndIndexes<
  Model, PartitionKey, GlobalIndexes, LocalIndexes
> extends DynamoTableWithSimpleKey<Model, PartitionKey> {
  public onIndex: GlobalIndexes & LocalIndexes

  constructor(
    tableName: string,
    globalIndexes: GlobalIndexes,
    localIndexes: LocalIndexes,
    operations: IOperations,
  ) {
    super(tableName, operations)
    this.onIndex = Object.assign({}, globalIndexes, localIndexes)
  }
}
