import DynamoClient from '../operations/dynamo-client'
import {
  DynamoIndexWithCompositeKey,
  DynamoIndexWithSimpleKey,
} from '../schema/dynamo-index'
import {
  CompositeKeyWithGlobalIndex,
} from '../schema/type-dynamo/define-table/composite-key/composite-key-with-global-index'
import {
  SimpleKeyWithGlobalIndex,
} from '../schema/type-dynamo/define-table/simple-key/composite-key-with-global-index'

export interface ISdkOptions {
  region: string
  accessKeyId?: string,
  secretAccessKey?: string,
  credentials?: AWS.Credentials
  credentialProvider?: AWS.CredentialProviderChain,
  apiVersion?: string,
  endpoint?: string,
  sslEnabled?: boolean,
  sessionToken?: string,
  maxRetries?: number,
  maxRedirects?: number,
  daxEndpoints?: string[]
}

export interface ISimpleKeySchema<PartitionKey> {
  tableName: string,
  partitionKey: PartitionKey,
}

export interface ICompositeKeySchema<PartitionKey, SortKey> {
  tableName: string,
  partitionKey: PartitionKey,
  sortKey: SortKey,
}

export type ProjectionType = 'ALL' | 'INCLUDE' | 'KEYS_ONLY'

export interface IEntitySchema {
  tableName: string
  tableSchema?: ITableSchema,
  indexSchema?: IndexSchema
  dynamoClient: DynamoClient
}

export interface IndexSchema {
  tableName: string,
  indexName: string,
  projectionType: ProjectionType,
  attributes?: string[]
  partitionKey: string,
  sortKey?: string,
}

export interface ITableSchema {
  tableName: string
  partitionKey: string,
  sortKey?: string
}

export interface IIndexSimpleKeyAndKeysOnly<IndexName, IndexPartitionKey> {
  indexName: IndexName,
  projectionType: 'KEYS_ONLY',
  partitionKey: IndexPartitionKey,
}

export type CompositeKeyWithGlobalIndexSimpleKeyAndKeysOnly<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model,
  IndexName extends string, IndexPartitionKey extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes
> =
  CompositeKeyWithGlobalIndex<
    Model, PartitionKey, SortKey, CurrentGlobalIndexes & {
    [P in IndexName]: DynamoIndexWithSimpleKey<
      Pick<Model, IndexPartitionKey> & Pick<Model, PartitionKey | SortKey>,
      Pick<Model, IndexPartitionKey>,
      Pick<Model, PartitionKey | SortKey> & Pick<Model, IndexPartitionKey>
    >
  }, CurrentLocalIndexes
  >

export interface IIndexCompositeKeyAndKeysOnly<
  IndexName, IndexPartitionKey, IndexSortKey
  > {
  indexName: IndexName,
  projectionType: 'KEYS_ONLY',
  partitionKey: IndexPartitionKey,
  sortKey: IndexSortKey,
}

export type CompositeKeyWithGlobalIndexCompositeKeyAndKeysOnly<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model,
  IndexName extends string, IndexPartitionKey extends keyof Model,
  IndexSortKey extends keyof Model, CurrentGlobalIndexes, CurrentLocalIndexes
> =
  CompositeKeyWithGlobalIndex<Model, PartitionKey, SortKey, CurrentGlobalIndexes
    & {
    [P in IndexName]: DynamoIndexWithCompositeKey<
      Pick<Model, IndexPartitionKey | IndexSortKey> &
        Pick<Model, PartitionKey | SortKey>,
      Pick<Model, IndexPartitionKey>,
      Pick<Model, IndexSortKey>,
      Pick<Model, PartitionKey | SortKey> &
        Pick<Model, IndexPartitionKey | IndexSortKey>
    >
}, CurrentLocalIndexes>

export interface IIndexSimpleKeyAndAllAttributes<IndexName, IndexPartitionKey> {
  indexName: IndexName,
  projectionType: 'ALL',
  partitionKey: IndexPartitionKey,
}

export type CompositeKeyWithGlobalIndexSimpleKeyAndAllAttributes<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model,
  IndexName extends string, IndexPartitionKey extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes
> = CompositeKeyWithGlobalIndex<
  Model, PartitionKey, SortKey, CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithSimpleKey<Model,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, PartitionKey | SortKey> & Pick<Model, IndexPartitionKey>>
}, CurrentLocalIndexes>

export interface IIndexCompositeKeyAndAllAttributes<
  IndexName, IndexPartitionKey, IndexSortKey
> {
  indexName: IndexName,
  projectionType: 'ALL',
  partitionKey: IndexPartitionKey,
  sortKey: IndexSortKey
}

export type CompositeKeyWithGlobalIndexCompositeKeyAndAllAttributes<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model,
  IndexName extends string, IndexPartitionKey extends keyof Model,
  IndexSortKey extends keyof Model, CurrentGlobalIndexes, CurrentLocalIndexes
> = CompositeKeyWithGlobalIndex<
  Model, PartitionKey, SortKey, CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithCompositeKey<Model,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, IndexSortKey>,
    Pick<Model, PartitionKey | SortKey> &
    Pick<Model, IndexPartitionKey | IndexSortKey>>
}, CurrentLocalIndexes>

export interface IIndexSimpleKeyAndIncludeAttributes<
  IndexName, IndexPartitionKey, IndexAttributes
> {
  indexName: IndexName,
  projectionType: 'INCLUDE',
  attributes: IndexAttributes[],
  partitionKey: IndexPartitionKey,
}

export type CompositeKeyWithGlobalIndexSimpleKeyAndIncludeAttributes<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model,
  IndexName extends string, IndexPartitionKey extends keyof Model,
  IndexAttributes extends keyof Model, CurrentGlobalIndexes, CurrentLocalIndexes
  > =
  CompositeKeyWithGlobalIndex<
    Model, PartitionKey, SortKey, CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithSimpleKey<
    Pick<Model, IndexPartitionKey | IndexAttributes> &
    Pick<Model, PartitionKey | SortKey>,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, PartitionKey | SortKey> & Pick<Model, IndexPartitionKey>>
}, CurrentLocalIndexes>

export interface IIndexCompositeKeyAndIncludeAttributes<
  IndexName, IndexPartitionKey, IndexSortKey, IndexAttributes
  > {
  indexName: IndexName,
  projectionType: 'INCLUDE',
  attributes: IndexAttributes[],
  partitionKey: IndexPartitionKey,
  sortKey: IndexSortKey,
}

export type CompositeKeyWithGlobalIndexCompositeKeyAndIncludeAttributes<
  Model, PartitionKey extends keyof Model, SortKey extends keyof Model,
  IndexName extends string, IndexPartitionKey extends keyof Model,
  IndexSortKey extends keyof Model, IndexAttributes extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes
  > = CompositeKeyWithGlobalIndex<Model, PartitionKey, SortKey,
  CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithCompositeKey<
    Pick<Model, IndexPartitionKey | IndexSortKey | IndexAttributes> &
    Pick<Model, PartitionKey | SortKey>,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, IndexSortKey>,
    Pick<Model, PartitionKey | SortKey> &
    Pick<Model, IndexPartitionKey | IndexSortKey>>
}, CurrentLocalIndexes>

export type SimpleKeyWithGlobalIndexSimpleKeyAndKeysOnly<Model,
  PartitionKey extends keyof Model, IndexName extends string,
  IndexPartitionKey extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes> =
  SimpleKeyWithGlobalIndex<Model, PartitionKey, CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithSimpleKey<Pick<Model, IndexPartitionKey> &
      Pick<Model, PartitionKey>,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, PartitionKey> & Pick<Model, IndexPartitionKey>>
}, CurrentLocalIndexes>

export type SimpleKeyWithGlobalIndexCompositeKeyAndKeysOnly<
  Model, PartitionKey extends keyof Model, IndexName extends string,
  IndexPartitionKey extends keyof Model, IndexSortKey extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes
> =
  SimpleKeyWithGlobalIndex<Model, PartitionKey, CurrentGlobalIndexes & {
    [P in IndexName]: DynamoIndexWithCompositeKey<
      Pick<Model, IndexPartitionKey | IndexSortKey> & Pick<Model, PartitionKey>,
      Pick<Model, IndexPartitionKey>,
      Pick<Model, IndexSortKey>,
      Pick<Model, PartitionKey> & Pick<Model, IndexPartitionKey | IndexSortKey>>
  }, CurrentLocalIndexes>

export type SimpleKeyWithGlobalIndexSimpleKeyAndAllAttributes<
  Model, PartitionKey extends keyof Model, IndexName extends string,
  IndexPartitionKey extends keyof Model, CurrentGlobalIndexes,
  CurrentLocalIndexes
>
  = SimpleKeyWithGlobalIndex<Model, PartitionKey, CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithSimpleKey<Model,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, PartitionKey> & Pick<Model, IndexPartitionKey>>
}, CurrentLocalIndexes>

export type SimpleKeyWithGlobalIndexCompositeKeyAndAllAttributes
<Model, PartitionKey extends keyof Model, IndexName extends string,
  IndexPartitionKey extends keyof Model, IndexSortKey extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes
>
= SimpleKeyWithGlobalIndex<Model, PartitionKey, CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithCompositeKey<Model,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, IndexSortKey>,
    Pick<Model, PartitionKey> & Pick<Model, IndexPartitionKey | IndexSortKey>>
}, CurrentLocalIndexes>

export type SimpleKeyWithGlobalIndexSimpleKeyAndIncludeAttributes<
  Model, PartitionKey extends keyof Model, IndexName extends string,
  IndexPartitionKey extends keyof Model, IndexAttributes extends keyof Model,
  CurrentGlobalIndexes, CurrentLocalIndexes
>
= SimpleKeyWithGlobalIndex<Model, PartitionKey, CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithSimpleKey<
    Pick<Model, IndexPartitionKey | IndexAttributes> &
    Pick<Model, PartitionKey>,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, PartitionKey> & Pick<Model, IndexPartitionKey>>
}, CurrentLocalIndexes>

export type SimpleKeyWithGlobalIndexCompositeKeyAndIncludeAttributes<
  Model, PartitionKey extends keyof Model, IndexName extends string,
  IndexPartitionKey extends keyof Model, IndexSortKey extends keyof Model,
  IndexAttributes extends keyof Model, CurrentGlobalIndexes, CurrentLocalIndexes
> = SimpleKeyWithGlobalIndex<Model, PartitionKey, CurrentGlobalIndexes & {
  [P in IndexName]: DynamoIndexWithCompositeKey<
    Pick<Model, IndexPartitionKey | IndexSortKey | IndexAttributes> &
    Pick<Model, PartitionKey>,
    Pick<Model, IndexPartitionKey>,
    Pick<Model, IndexSortKey>,
    Pick<Model, PartitionKey> & Pick<Model, IndexPartitionKey | IndexSortKey>>
}, CurrentLocalIndexes>
