export type ProjectionType = 'ALL' | 'INCLUDE' | 'KEYS_ONLY'

export interface EntitySchema {
    tableName: string
    tableSchema?: TableSchema,
    indexSchema?: IndexSchema
}

export interface IndexSchema {
    tableName: string,
    indexName: string,
    projectionType: ProjectionType,
    attributes?: string[]
    readCapacity: number
    writeCapacity: number
    partitionKey: string,
    sortKey?: string,
}

export interface TableSchema {
    tableName: string
    partitionKey: string,
    sortKey?: string
    readCapacity: number
    writeCapacity: number
}

export { defineTable } from './define-table'
export { globalIndex } from './global-index'
export { withGlobalIndexes } from './with-global-indexes'
export { localIndex } from './local-index'
export { withLocalIndexes } from './with-local-indexes'
