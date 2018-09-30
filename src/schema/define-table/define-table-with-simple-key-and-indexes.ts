import { IOperations } from '../../types'
import {
  IIndexCompositeKeyAndAllAttributes,
  IIndexCompositeKeyAndIncludeAttributes,
  IIndexCompositeKeyAndKeysOnly,
  IIndexSimpleKeyAndAllAttributes,
  IIndexSimpleKeyAndIncludeAttributes,
  IIndexSimpleKeyAndKeysOnly,
  SimpleKeyWithGlobalIndexCompositeKeyAndAllAttributes,
  SimpleKeyWithGlobalIndexCompositeKeyAndIncludeAttributes,
  SimpleKeyWithGlobalIndexCompositeKeyAndKeysOnly,
  SimpleKeyWithGlobalIndexSimpleKeyAndAllAttributes,
  SimpleKeyWithGlobalIndexSimpleKeyAndIncludeAttributes,
  SimpleKeyWithGlobalIndexSimpleKeyAndKeysOnly,
} from '../../types/schema'
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
  PartitionKey extends keyof Model, CurrentGlobalIndexes, CurrentLocalIndexes> {
  constructor(
    private tableName: string,
    private currentGlobalIndexes: CurrentGlobalIndexes,
    private currentLocalIndexes: CurrentLocalIndexes,
    private operations: IOperations,
  ) { }

  public getInstance(): DynamoTableWithSimpleKeyAndIndexes<Model,
    Pick<Model, PartitionKey>, CurrentGlobalIndexes, CurrentLocalIndexes> {
    return new DynamoTableWithSimpleKeyAndIndexes(
      this.tableName, this.currentGlobalIndexes, this.currentLocalIndexes,
      this.operations,
    ) as any
  }

  public withGlobalIndex< // simple key; keys only
    IndexName extends string, IndexPartitionKey extends keyof Model>(
    config: IIndexSimpleKeyAndKeysOnly<IndexName, IndexPartitionKey>,
  ): SimpleKeyWithGlobalIndexSimpleKeyAndKeysOnly<Model, PartitionKey,
    IndexName, IndexPartitionKey, CurrentGlobalIndexes, CurrentLocalIndexes>

  public withGlobalIndex< // composite key; keys only
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model>(
    config: IIndexCompositeKeyAndKeysOnly<
      IndexName, IndexPartitionKey, IndexSortKey
      >,
  ): SimpleKeyWithGlobalIndexCompositeKeyAndKeysOnly<
    Model, PartitionKey, IndexName, IndexPartitionKey, IndexSortKey,
    CurrentGlobalIndexes, CurrentLocalIndexes>

  public withGlobalIndex< // simple key; all attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model>(
    config: IIndexSimpleKeyAndAllAttributes<IndexName, IndexPartitionKey>,
  ): SimpleKeyWithGlobalIndexSimpleKeyAndAllAttributes<
    Model, PartitionKey, IndexName, IndexPartitionKey, CurrentGlobalIndexes,
    CurrentLocalIndexes>

  public withGlobalIndex< // composite key; all attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model>(
    config: IIndexCompositeKeyAndAllAttributes<
      IndexName, IndexPartitionKey, IndexSortKey>,
  ): SimpleKeyWithGlobalIndexCompositeKeyAndAllAttributes<
    Model, PartitionKey, IndexName, IndexPartitionKey, IndexSortKey,
    CurrentGlobalIndexes, CurrentLocalIndexes>

  public withGlobalIndex< // simple key; include attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexAttributes extends keyof Model>(
    config: IIndexSimpleKeyAndIncludeAttributes<
      IndexName, IndexPartitionKey, IndexAttributes
      >,
  ): SimpleKeyWithGlobalIndexSimpleKeyAndIncludeAttributes<
    Model, PartitionKey, IndexName, IndexPartitionKey, IndexAttributes,
    CurrentGlobalIndexes, CurrentLocalIndexes>

  public withGlobalIndex< // composite key; include attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model,
    IndexAttributes extends keyof Model>(
    config: IIndexCompositeKeyAndIncludeAttributes<
      IndexName, IndexPartitionKey, IndexSortKey, IndexAttributes>,
  ): SimpleKeyWithGlobalIndexCompositeKeyAndIncludeAttributes<
    Model, PartitionKey, IndexName, IndexPartitionKey, IndexSortKey,
    IndexAttributes, CurrentGlobalIndexes, CurrentLocalIndexes>

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
