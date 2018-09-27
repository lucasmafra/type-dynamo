import DynamoClient from '../../../../operations/dynamo-client'
import {
  DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey,
} from '../../../../schema/dynamo-index'
import { DynamoORMWithCompositeKey } from '../../../../schema/dynamo-orm'
import {
  CompositeKeyWithGlobalIndexCompositeKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndKeysOnly,
  CompositeKeyWithGlobalIndexSimpleKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndKeysOnly,
  IIndexCompositeKeyAndAllAttributes, IIndexCompositeKeyAndIncludeAttributes,
  IIndexCompositeKeyAndKeysOnly, IIndexSimpleKeyAndAllAttributes,
  IIndexSimpleKeyAndIncludeAttributes, IIndexSimpleKeyAndKeysOnly, ITableSchema,
} from '../../../../types'

export class CompositeKeyWithGlobalIndex<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes> {
  private dynamoClient: DynamoClient
  private tableSchema: ITableSchema
  private currentGlobalIndexes: CurrentGlobalIndexes
  private currentLocalIndexes: CurrentLocalIndexes

  constructor(
    dynamoClient: DynamoClient,
    tableSchema: ITableSchema,
    currentGlobalIndexes: CurrentGlobalIndexes,
    currentLocalIndexes: CurrentLocalIndexes,
  ) {
    this.dynamoClient = dynamoClient
    this.tableSchema = tableSchema
    this.currentGlobalIndexes = currentGlobalIndexes
    this.currentLocalIndexes = currentLocalIndexes
  }

  public getInstance(): DynamoORMWithCompositeKey<
    Model, Pick<Model, PartitionKey>, Pick<Model, SortKey>,
    CurrentGlobalIndexes, CurrentLocalIndexes> {
    return new DynamoORMWithCompositeKey(
      this.tableSchema,
      this.currentGlobalIndexes,
      this.currentLocalIndexes,
      this.dynamoClient,
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
    if (config.sortKey) {
      this.currentGlobalIndexes = {
        ...this.currentGlobalIndexes as any,
        [config.indexName]: new DynamoIndexWithCompositeKey(config),
      }
      return new CompositeKeyWithGlobalIndex(
        this.dynamoClient,
        this.tableSchema,
        this.currentGlobalIndexes,
        this.currentLocalIndexes,
      )
    }
    this.currentGlobalIndexes = {
      ...this.currentGlobalIndexes as any,
      [config.indexName]: new DynamoIndexWithSimpleKey(config),
    }
    return new CompositeKeyWithGlobalIndex(
      this.dynamoClient,
      this.tableSchema,
      this.currentGlobalIndexes,
      this.currentLocalIndexes,
    )
  }

}
