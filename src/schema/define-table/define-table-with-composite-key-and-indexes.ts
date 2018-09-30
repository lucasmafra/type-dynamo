import {
  IOperations,
} from '../../types'
import {
  CompositeKeyWithGlobalIndexCompositeKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndKeysOnly,
  CompositeKeyWithGlobalIndexSimpleKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndKeysOnly,
  IIndexCompositeKeyAndAllAttributes,
  IIndexCompositeKeyAndIncludeAttributes,
  IIndexCompositeKeyAndKeysOnly,
  IIndexSimpleKeyAndAllAttributes,
  IIndexSimpleKeyAndIncludeAttributes,
  IIndexSimpleKeyAndKeysOnly,
} from '../../types'
import {
  DynamoIndexWithCompositeKey,
} from '../dynamo-index/dynamo-index-with-composite-key'
import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithCompositeKeyAndIndexes,
} from '../dynamo-table/dynamo-table-with-composite-key-and-indexes'

export class DefineTableWithCompositeKeyAndIndexes<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes> {
  constructor(
    private tableName: string,
    private currentGlobalIndexes: CurrentGlobalIndexes,
    private currentLocalIndexes: CurrentLocalIndexes,
    private operations: IOperations,
  ) { }

  public getInstance(): DynamoTableWithCompositeKeyAndIndexes<
    Model, Pick<Model, PartitionKey>, Pick<Model, SortKey>,
    CurrentGlobalIndexes, CurrentLocalIndexes> {
    return new DynamoTableWithCompositeKeyAndIndexes(
      this.tableName, this.currentGlobalIndexes, this.currentLocalIndexes,
      this.operations,
    )
  }

  public withGlobalIndex< // simple key; keys only
    IndexName extends string, IndexPartitionKey extends keyof Model>(
    config: IIndexSimpleKeyAndKeysOnly<IndexName, IndexPartitionKey>)
    : CompositeKeyWithGlobalIndexSimpleKeyAndKeysOnly<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey,
    CurrentGlobalIndexes, CurrentLocalIndexes>

  public withGlobalIndex< // composite key; keys only
    IndexName extends string, IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model>(
    config: IIndexCompositeKeyAndKeysOnly<IndexName, IndexPartitionKey,
      IndexSortKey>,
  ): CompositeKeyWithGlobalIndexCompositeKeyAndKeysOnly<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, IndexSortKey,
    CurrentGlobalIndexes, CurrentLocalIndexes
    >

  public withGlobalIndex< // simple key; all attributes
    IndexName extends string, IndexPartitionKey extends keyof Model>(
    config: IIndexSimpleKeyAndAllAttributes<IndexName, IndexPartitionKey>,
  ): CompositeKeyWithGlobalIndexSimpleKeyAndAllAttributes<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey,
    CurrentGlobalIndexes, CurrentLocalIndexes
    >

  public withGlobalIndex< // composite key; all attributes
    IndexName extends string, IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model>(
    config: IIndexCompositeKeyAndAllAttributes<IndexName, IndexPartitionKey,
      IndexSortKey>,
  ): CompositeKeyWithGlobalIndexCompositeKeyAndAllAttributes<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, IndexSortKey,
    CurrentGlobalIndexes, CurrentLocalIndexes
    >

  public withGlobalIndex< // simple key; include attributes
    IndexName extends string, IndexPartitionKey extends keyof Model,
    IndexAttributes extends keyof Model>(
    config: IIndexSimpleKeyAndIncludeAttributes<IndexName, IndexPartitionKey,
      IndexAttributes>,
  ): CompositeKeyWithGlobalIndexSimpleKeyAndIncludeAttributes<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, IndexAttributes,
    CurrentGlobalIndexes, CurrentLocalIndexes
    >

  public withGlobalIndex< // composite key; include attributes
    IndexName extends string, IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model, IndexAttributes extends keyof Model>(
    config: IIndexCompositeKeyAndIncludeAttributes<IndexName, IndexPartitionKey,
      IndexSortKey, IndexAttributes>,
  ): CompositeKeyWithGlobalIndexCompositeKeyAndIncludeAttributes<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, IndexSortKey,
    IndexAttributes, CurrentGlobalIndexes, CurrentLocalIndexes
    >

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
