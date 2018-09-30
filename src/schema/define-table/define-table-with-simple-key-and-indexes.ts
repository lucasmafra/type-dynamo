import { IDefineTableWithSimpleKeyAndIndexes, IOperations } from '../../types'
import {
  DynamoIndexWithCompositeKey,
} from '../dynamo-index/dynamo-index-with-composite-key'
import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithSimpleKeyAndIndexes,
} from '../dynamo-table/dynamo-table-with-simple-key-and-indexes'

export class DefineTableWithSimpleKeyAndIndexes<Model,
  PartitionKey extends keyof Model, CurrentGlobalIndexes, CurrentLocalIndexes>
  implements IDefineTableWithSimpleKeyAndIndexes<Model, PartitionKey,
  CurrentGlobalIndexes, CurrentLocalIndexes> {
  constructor(
    private tableName: string,
    private currentGlobalIndexes: CurrentGlobalIndexes,
    private currentLocalIndexes: CurrentLocalIndexes,
    private operations: IOperations,
  ) { }

  public getInstance() {
    return new DynamoTableWithSimpleKeyAndIndexes(
      this.tableName, this.currentGlobalIndexes, this.currentLocalIndexes,
      this.operations,
    ) as any
  }

  public withGlobalIndex(config: any) {
    this.currentGlobalIndexes = {
      ...this.currentGlobalIndexes as any,
      [config.indexName]: config.sortKey ?
        new DynamoIndexWithCompositeKey(
          this.tableName, config.indexName, this.operations,
        ) :
        new DynamoIndexWithSimpleKey(
          this.tableName, config.indexName, this.operations,
        ),
    }
    return this as any
  }
}
