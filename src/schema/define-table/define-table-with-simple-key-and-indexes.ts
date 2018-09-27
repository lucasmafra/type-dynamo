import DynamoClient from '../../operations/dynamo-client'
import { IHelpers, IIndexSchema } from '../../types'
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
} from '../../types/index'
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

  public getInstance(): DynamoTableWithSimpleKeyAndIndexes<Model,
    Pick<Model, PartitionKey>, CurrentGlobalIndexes, CurrentLocalIndexes> {
    return new DynamoTableWithSimpleKeyAndIndexes(
      this.tableSchema,
      this.currentGlobalIndexes,
      this.currentLocalIndexes,
      this.dynamoClient,
      this.helpers,
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
      return new DefineTableWithSimpleKeyAndIndexes(
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
    return new DefineTableWithSimpleKeyAndIndexes(
      this.dynamoClient,
      this.helpers,
      this.tableSchema,
      this.currentGlobalIndexes,
      this.currentLocalIndexes,
    )
  }
}
