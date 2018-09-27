import DynamoClient from '../../operations/dynamo-client'
import {
  CompositeKeyWithGlobalIndexCompositeKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndKeysOnly,
  CompositeKeyWithGlobalIndexSimpleKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndKeysOnly, IHelpers,
  IIndexCompositeKeyAndAllAttributes, IIndexCompositeKeyAndIncludeAttributes,
  IIndexCompositeKeyAndKeysOnly, IIndexSchema, IIndexSimpleKeyAndAllAttributes,
  IIndexSimpleKeyAndIncludeAttributes, IIndexSimpleKeyAndKeysOnly, ITableSchema,
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
  private dynamoClient: DynamoClient
  private helpers: IHelpers
  private tableSchema: ITableSchema
  private currentGlobalIndexes: CurrentGlobalIndexes
  private currentLocalIndexes: CurrentLocalIndexes

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    tableSchema: ITableSchema,
    currentGlobalIndexes: CurrentGlobalIndexes,
    currentLocalIndexes: CurrentLocalIndexes,
  ) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
    this.tableSchema = tableSchema
    this.currentGlobalIndexes = currentGlobalIndexes
    this.currentLocalIndexes = currentLocalIndexes
  }

  public getInstance(): DynamoTableWithCompositeKeyAndIndexes<
    Model, Pick<Model, PartitionKey>, Pick<Model, SortKey>,
    CurrentGlobalIndexes, CurrentLocalIndexes> {
    return new DynamoTableWithCompositeKeyAndIndexes(
      this.tableSchema,
      this.currentGlobalIndexes,
      this.currentLocalIndexes,
      this.dynamoClient,
      this.helpers,
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
    const indexSchema: IIndexSchema = {
      tableName: this.tableSchema.tableName,
      indexName: config.indexName,
      projectionType: config.projectionType,
      partitionKey: config.partitionKey,
      sortKey: config.sortKey,
    }
    if (config.sortKey) {
      this.currentGlobalIndexes = {
        ...this.currentGlobalIndexes as any,
        [config.indexName]: new DynamoIndexWithCompositeKey(
          indexSchema, this.dynamoClient, this.helpers,
        ),
      }
      return new DefineTableWithCompositeKeyAndIndexes(
        this.dynamoClient,
        this.helpers,
        this.tableSchema,
        this.currentGlobalIndexes,
        this.currentLocalIndexes,
      )
    }
    this.currentGlobalIndexes = {
      ...this.currentGlobalIndexes as any,
      [config.indexName]: new DynamoIndexWithSimpleKey(
        indexSchema, this.dynamoClient, this.helpers,
      ),
    }
    return new DefineTableWithCompositeKeyAndIndexes(
      this.dynamoClient,
      this.helpers,
      this.tableSchema,
      this.currentGlobalIndexes,
      this.currentLocalIndexes,
    )
  }
}
