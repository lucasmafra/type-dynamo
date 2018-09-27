import DynamoClient from '../../operations/dynamo-client'
import {
  CompositeKeyWithGlobalIndexCompositeKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndKeysOnly,
  CompositeKeyWithGlobalIndexSimpleKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndKeysOnly,
  ICompositeKeySchema,
  IHelpers,
  IIndexCompositeKeyAndAllAttributes,
  IIndexCompositeKeyAndIncludeAttributes,
  IIndexCompositeKeyAndKeysOnly, IIndexSchema,
  IIndexSimpleKeyAndAllAttributes,
  IIndexSimpleKeyAndIncludeAttributes,
  IIndexSimpleKeyAndKeysOnly,
  ITableSchema,
} from '../../types'
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
  PartitionKey extends keyof Model, SortKey extends keyof Model> {
  private dynamoClient: DynamoClient
  private tableSchema: ITableSchema
  private helpers: IHelpers

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    schema: ICompositeKeySchema<PartitionKey, SortKey>,
  ) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
    this.tableSchema = this.buildTableSchema(schema)
  }

  public getInstance(): DynamoTableWithCompositeKey<
    Model, Pick<Model, PartitionKey>, Pick<Model, SortKey>
  > {
    return new DynamoTableWithCompositeKey(
      this.tableSchema, this.dynamoClient, this.helpers,
    )
  }

  public withGlobalIndex< // simple key; keys only
    IndexName extends string, IndexPartitionKey extends keyof Model>(
    config: IIndexSimpleKeyAndKeysOnly<IndexName, IndexPartitionKey>,
  ): CompositeKeyWithGlobalIndexSimpleKeyAndKeysOnly<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, {}, {}
  >

  public withGlobalIndex< // composite key; keys only
    IndexName extends string, IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model>(config: IIndexCompositeKeyAndKeysOnly<
      IndexName, IndexPartitionKey, IndexSortKey
    >,
  ): CompositeKeyWithGlobalIndexCompositeKeyAndKeysOnly<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, IndexSortKey,
    {}, {}
  >

  public withGlobalIndex< // simple key; all attributes
    IndexName extends string, IndexPartitionKey extends keyof Model>(
    config: IIndexSimpleKeyAndAllAttributes<IndexName, IndexPartitionKey>,
  ): CompositeKeyWithGlobalIndexSimpleKeyAndAllAttributes<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, {}, {}
  >

  public withGlobalIndex< // composite key; all attributes
    IndexName extends string, IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model>(
    config: IIndexCompositeKeyAndAllAttributes<
      IndexName, IndexPartitionKey, IndexSortKey
    >,
  ): CompositeKeyWithGlobalIndexCompositeKeyAndAllAttributes<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, IndexSortKey,
    {}, {}
  >

  public withGlobalIndex< // simple key; include attributes
    IndexName extends string, IndexPartitionKey extends keyof Model,
    IndexAttributes extends keyof Model>(
    config: IIndexSimpleKeyAndIncludeAttributes<
      IndexName, IndexPartitionKey, IndexAttributes
    >,
  ): CompositeKeyWithGlobalIndexSimpleKeyAndIncludeAttributes<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, IndexAttributes,
    {}, {}
  >

  public withGlobalIndex< // composite key; include attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model,
    IndexAttributes extends keyof Model>(
    config: IIndexCompositeKeyAndIncludeAttributes<
      IndexName, IndexPartitionKey, IndexSortKey, IndexAttributes
    >,
  ): CompositeKeyWithGlobalIndexCompositeKeyAndIncludeAttributes<
    Model, PartitionKey, SortKey, IndexName, IndexPartitionKey, IndexSortKey,
    IndexAttributes, {}, {}
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
      return new DefineTableWithCompositeKeyAndIndexes(
        this.dynamoClient, this.helpers, this.tableSchema,
        {[config.indexName]: new DynamoIndexWithCompositeKey(
          indexSchema, this.dynamoClient, this.helpers,
        ) },
        {},
      )
    }
    return new DefineTableWithCompositeKeyAndIndexes(
      this.dynamoClient, this.helpers, this.tableSchema,
      {[config.indexName]: new DynamoIndexWithSimpleKey(
        indexSchema, this.dynamoClient, this.helpers,
        )},
      {},
    )
  }

  private buildTableSchema(schema: any): ITableSchema {
    const { tableName, partitionKey, sortKey } = schema
    return { tableName, partitionKey, sortKey }
  }
}
