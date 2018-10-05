import { BatchGet } from '../operations/batch-get'
import { Get } from '../operations/get'
import { Query } from '../operations/query'
import { Scan } from '../operations/scan'

export interface IBatchGetInput<KeySchema> {
  tableName: string
  keys: KeySchema[]
  withAttributes?: string[]
}

export interface IBatchGetResult<Model> {
  data: Model[]
}

export interface IGetInput<KeySchema> {
  tableName: string
  key: KeySchema
  withAttributes?: string[]
}

export interface IGetResult<Model, KeySchema> { data: Model }

export interface IQueryInput<KeySchema, PartitionKey> {
  tableName: string,
  indexName?: string,
  partitionKey: PartitionKey
  paginate?: IQueryPaginationOptions<KeySchema>
  allResults?: boolean
  withAttributes?: string[]
}

export interface IQueryResult<Model, KeySchema> {
  data: Model[]
  lastKey?: KeySchema
}

export interface IQueryPaginationOptions<KeySchema> {
  lastKey?: KeySchema,
  limit?: number
}

export interface IScanPagination<KeySchema> {
  limit?: number
  lastKey?: KeySchema
}

export interface IScanInput<KeySchema> {
  tableName: string
  indexName?: string
  withAttributes?: string[]
  paginate?: IScanPagination<KeySchema>
  allResults?: boolean
}

export interface IScanResult<Model, KeySchema> {
  data: Model[]
  lastKey?: KeySchema
}

export interface IPutInput<Model> {
  tableName: string
  item: Model
}

export interface IPutOutput<Model> {
  data: Model,
}

export interface IOperations {
  get: Get
  batchGet: BatchGet
  query: Query
  scan: Scan
}
