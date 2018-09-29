import { IOperations } from '../../types'
import { DynamoTableWithCompositeKey } from './dynamo-table-with-composite-key'

export class DynamoTableWithCompositeKeyAndIndexes<
  Model, PartitionKey, SortKey, GlobalIndexes, LocalIndexes
  > extends DynamoTableWithCompositeKey<Model, PartitionKey, SortKey> {
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
