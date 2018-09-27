import DynamoClient from '../../../../operations/dynamo-client'
import {
  IIndexCompositeKeyAndAllAttributes, IIndexCompositeKeyAndIncludeAttributes,
  IIndexCompositeKeyAndKeysOnly, IIndexSimpleKeyAndAllAttributes,
  IIndexSimpleKeyAndIncludeAttributes, IIndexSimpleKeyAndKeysOnly, ITableSchema,
  SimpleKeyWithGlobalIndexCompositeKeyAndAllAttributes,
  SimpleKeyWithGlobalIndexCompositeKeyAndIncludeAttributes,
  SimpleKeyWithGlobalIndexCompositeKeyAndKeysOnly,
  SimpleKeyWithGlobalIndexSimpleKeyAndAllAttributes,
  SimpleKeyWithGlobalIndexSimpleKeyAndIncludeAttributes,
  SimpleKeyWithGlobalIndexSimpleKeyAndKeysOnly,
} from '../../../../types'
import {
  DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey,
} from '../../../dynamo-index'
import { DynamoORMWithSimpleKey } from '../../../dynamo-orm'

export class SimpleKeyWithGlobalIndex<Model,
  PartitionKey extends keyof Model, CurrentGlobalIndexes, CurrentLocalIndexes> {
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

  public getInstance(): DynamoORMWithSimpleKey<Model,
    Pick<Model, PartitionKey>, CurrentGlobalIndexes, CurrentLocalIndexes> {
    return new DynamoORMWithSimpleKey(
      this.tableSchema,
      this.currentGlobalIndexes,
      this.currentLocalIndexes,
      this.dynamoClient,
    )
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
    if (config.sortKey) {
      this.currentGlobalIndexes = {
        ...this.currentGlobalIndexes as any,
        [config.indexName]: new DynamoIndexWithCompositeKey(config),
      }
      return new SimpleKeyWithGlobalIndex(
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
    return new SimpleKeyWithGlobalIndex(
      this.dynamoClient,
      this.tableSchema,
      this.currentGlobalIndexes,
      this.currentLocalIndexes,
    )
  }
}
