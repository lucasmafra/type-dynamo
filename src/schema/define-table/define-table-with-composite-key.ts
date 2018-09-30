import { IDefineTableWithCompositeKey, IOperations } from '../../types'
import {
  DynamoIndexWithCompositeKey,
} from '../dynamo-index/dynamo-index-with-composite-key'
import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithCompositeKey,
} from '../dynamo-table/dynamo-table-with-composite-key'
import {
  DefineTableWithCompositeKeyAndIndexes,
} from './define-table-with-composite-key-and-indexes'

export class DefineTableWithCompositeKey<Model,
  PartitionKey extends keyof Model, SortKey extends keyof Model>
implements  IDefineTableWithCompositeKey<Model, PartitionKey, SortKey> {
  constructor(private tableName: string, private operations: IOperations) { }

  public getInstance() {
    return new DynamoTableWithCompositeKey(
      this.tableName, this.operations,
    ) as any
  }

  public withGlobalIndex(config: any) {
    const currentGlobalIndexes = {
      [config.indexName]: config.sortKey ?
        new DynamoIndexWithCompositeKey(
          this.tableName, config.indexName, this.operations,
        ) :
        new DynamoIndexWithSimpleKey(
          this.tableName, config.indexName, this.operations,
        ),
    } as any
    return new DefineTableWithCompositeKeyAndIndexes(
      this.tableName, currentGlobalIndexes, {}, this.operations,
    )
  }
}
