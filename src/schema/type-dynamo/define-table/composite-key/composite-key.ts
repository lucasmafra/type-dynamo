import DynamoClient from '../../../../operations/dynamo-client'
import {
  CompositeKeyWithGlobalIndexCompositeKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexCompositeKeyAndKeysOnly,
  CompositeKeyWithGlobalIndexSimpleKeyAndAllAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndIncludeAttributes,
  CompositeKeyWithGlobalIndexSimpleKeyAndKeysOnly, ICompositeKeySchema,
  IIndexCompositeKeyAndAllAttributes, IIndexCompositeKeyAndIncludeAttributes,
  IIndexCompositeKeyAndKeysOnly, IIndexSimpleKeyAndAllAttributes,
  IIndexSimpleKeyAndIncludeAttributes, IIndexSimpleKeyAndKeysOnly, ITableSchema,
} from '../../../../types'
import {
  DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey,
} from '../../../dynamo-index'
import { DynamoTableWithCompositeKey } from '../../../dynamo-table'
import { CompositeKeyWithGlobalIndex } from './composite-key-with-global-index'

export class CompositeKey<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model
> {
  private dynamoClient: DynamoClient
  private tableSchema: ITableSchema

  constructor(
    dynamoClient: DynamoClient,
    schema: ICompositeKeySchema<PartitionKey, SortKey>,
  ) {
    this.dynamoClient = dynamoClient
    this.tableSchema = this.buildTableSchema(schema)
  }

  public getInstance(): DynamoTableWithCompositeKey<
    Model, Pick<Model, PartitionKey>, Pick<Model, SortKey>
  > {
    return new DynamoTableWithCompositeKey(this.tableSchema, this.dynamoClient)
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
    if (config.sortKey) {
      return new CompositeKeyWithGlobalIndex(
        this.dynamoClient, this.tableSchema,
        {[config.indexName]: new DynamoIndexWithCompositeKey(config)},
        {},
      )
    }
    return new CompositeKeyWithGlobalIndex(
      this.dynamoClient, this.tableSchema,
      {[config.indexName]: new DynamoIndexWithSimpleKey(config)},
      {},
    )
  }

  private buildTableSchema(schema: any): ITableSchema {
    const { tableName, partitionKey, sortKey } = schema
    return { tableName, partitionKey, sortKey }
  }
}
