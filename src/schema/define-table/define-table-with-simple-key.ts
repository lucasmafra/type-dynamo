import DynamoClient from '../../operations/dynamo-client'
import { IIndexSchema } from '../../types'
import {
  IHelpers,
  IIndexCompositeKeyAndAllAttributes,
  IIndexCompositeKeyAndIncludeAttributes, IIndexCompositeKeyAndKeysOnly,
  IIndexSimpleKeyAndAllAttributes, IIndexSimpleKeyAndIncludeAttributes,
  IIndexSimpleKeyAndKeysOnly, ISimpleKeySchema, ITableSchema,
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
  DynamoTableWithSimpleKey,
} from '../dynamo-table/dynamo-table-with-simple-key'
import {
  DefineTableWithSimpleKeyAndIndexes,
} from './define-table-with-simple-key-and-indexes'

export class DefineTableWithSimpleKey<Model, PartitionKey extends keyof Model> {
  private dynamoClient: DynamoClient
  private tableSchema: ITableSchema
  private helpers: IHelpers

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    schema: ISimpleKeySchema<PartitionKey>,
  ) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
    this.tableSchema = this.buildTableSchema(schema)
  }

  public getInstance(): DynamoTableWithSimpleKey<
    Model, Pick<Model, PartitionKey>> {
    return new DynamoTableWithSimpleKey(
      this.tableSchema, this.dynamoClient, this.helpers,
    )
  }

  public withGlobalIndex< // simple key; keys only
    IndexName extends string, IndexPartitionKey extends keyof Model>(
    config: IIndexSimpleKeyAndKeysOnly<IndexName, IndexPartitionKey>,
  ): SimpleKeyWithGlobalIndexSimpleKeyAndKeysOnly<Model, PartitionKey,
    IndexName, IndexPartitionKey, {}, {}>

  public withGlobalIndex< // composite key; keys only
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model>(
    config: IIndexCompositeKeyAndKeysOnly<
      IndexName, IndexPartitionKey, IndexSortKey
    >,
  ): SimpleKeyWithGlobalIndexCompositeKeyAndKeysOnly<
    Model, PartitionKey, IndexName, IndexPartitionKey, IndexSortKey, {}, {}>

  public withGlobalIndex< // simple key; all attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model>(
    config: IIndexSimpleKeyAndAllAttributes<IndexName, IndexPartitionKey>,
  ): SimpleKeyWithGlobalIndexSimpleKeyAndAllAttributes<
    Model, PartitionKey, IndexName, IndexPartitionKey, {}, {}>

  public withGlobalIndex< // composite key; all attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model>(
    config: IIndexCompositeKeyAndAllAttributes<
      IndexName, IndexPartitionKey, IndexSortKey>,
  ): SimpleKeyWithGlobalIndexCompositeKeyAndAllAttributes<
    Model, PartitionKey, IndexName, IndexPartitionKey, IndexSortKey, {}, {}>

  public withGlobalIndex< // simple key; include attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexAttributes extends keyof Model>(
    config: IIndexSimpleKeyAndIncludeAttributes<
      IndexName, IndexPartitionKey, IndexAttributes
    >,
  ): SimpleKeyWithGlobalIndexSimpleKeyAndIncludeAttributes<
    Model, PartitionKey, IndexName, IndexPartitionKey, IndexAttributes, {}, {}
  >

  public withGlobalIndex< // composite key; include attributes
    IndexName extends string,
    IndexPartitionKey extends keyof Model,
    IndexSortKey extends keyof Model,
    IndexAttributes extends keyof Model>(
    config: IIndexCompositeKeyAndIncludeAttributes<
      IndexName, IndexPartitionKey, IndexSortKey, IndexAttributes>,
  ): SimpleKeyWithGlobalIndexCompositeKeyAndIncludeAttributes<
      Model, PartitionKey, IndexName, IndexPartitionKey, IndexSortKey,
      IndexAttributes, {}, {}>

  public withGlobalIndex(config: any) {
    const indexSchema: IIndexSchema = {
      tableName: this.tableSchema.tableName,
      indexName: config.indexName,
      projectionType: config.projectionType,
      partitionKey: config.partitionKey,
      sortKey: config.sortKey,
    }

    if (config.sortKey) {
      return new DefineTableWithSimpleKeyAndIndexes(
        this.dynamoClient,
        this.helpers,
        this.tableSchema,
        {[config.indexName]: new DynamoIndexWithCompositeKey(
          indexSchema, this.dynamoClient, this.helpers,
          )},
        {},
      )
    }
    return new DefineTableWithSimpleKeyAndIndexes(
      this.dynamoClient,
      this.helpers,
      this.tableSchema,
      {[config.indexName]: new DynamoIndexWithSimpleKey(
        indexSchema, this.dynamoClient, this.helpers,
        )},
      {},
    )
  }

  private buildTableSchema(schema: any): ITableSchema {
    const tableSchema: ITableSchema = {
      tableName: schema.tableName,
      partitionKey: schema.partitionKey,
    }
    return tableSchema
  }
}
