export type ProjectionType = 'ALL' | 'INCLUDE' | 'KEYS_ONLY'

export interface KeySchema {
    partitionKey: string,
    sortKey?: string
}

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
    keySchema: {
        partitionKey: string,
        sortKey?: string,
    },
}

export interface TableSchema {
    tableName: string
    keySchema: KeySchema
    readCapacity: number
    writeCapacity: number
}

export { defineTable } from './defineTable'
export { keySchema } from './keySchema'
export { globalIndex } from './globalIndex'
export { withGlobalIndexes } from './withGlobalIndexes'
export { localIndex } from './localIndex'
export { withLocalIndexes } from './withLocalIndexes'
