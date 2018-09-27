import DynamoClient from '../../../../operations/dynamo-client'
import { DynamoTableWithSimpleKey } from '../../../../schema/dynamo-table'
import {
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
} from '../../../../types'
import {
  DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey,
} from '../../../dynamo-index'
import { SimpleKeyWithGlobalIndex } from './simple-key-with-global-index'

export class SimpleKey<Model, PartitionKey extends keyof Model> {
  private dynamoClient: DynamoClient
  private tableSchema: ITableSchema

  constructor(
    dynamoClient: DynamoClient, schema: ISimpleKeySchema<PartitionKey>,
  ) {
    this.dynamoClient = dynamoClient
    this.tableSchema = this.buildTableSchema(schema)
  }

  public getInstance(): DynamoTableWithSimpleKey<
    Model, Pick<Model, PartitionKey>> {
    return new DynamoTableWithSimpleKey(this.tableSchema, this.dynamoClient)
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
    if (config.sortKey) {
      return new SimpleKeyWithGlobalIndex(
        this.dynamoClient,
        this.tableSchema,
        {[config.indexName]: new DynamoIndexWithCompositeKey(config)},
        {},
      )
    }
    return new SimpleKeyWithGlobalIndex(
      this.dynamoClient,
      this.tableSchema,
      {[config.indexName]: new DynamoIndexWithSimpleKey(config)},
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
