import { IDefineTableWithSimpleKey, IOperations } from '../../types'
import {
  DynamoIndexWithCompositeKey,
} from '../dynamo-index/dynamo-index-with-composite-key'
import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithSimpleKey,
} from '../dynamo-table/dynamo-table-with-simple-key'
import {
  DefineTableWithSimpleKeyAndIndexes,
} from './define-table-with-simple-key-and-indexes'

export class DefineTableWithSimpleKey<Model, PartitionKey extends keyof Model>
  implements IDefineTableWithSimpleKey<Model, PartitionKey> {

  constructor(private tableName: string, private operations: IOperations) { }

  public getInstance() {
    return new DynamoTableWithSimpleKey(this.tableName, this.operations) as any
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
    }
    return new DefineTableWithSimpleKeyAndIndexes(
      this.tableName, currentGlobalIndexes, {}, this.operations,
    ) as any
  }
}
