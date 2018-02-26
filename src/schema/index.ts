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
    globalIndex1?: IndexSchema
    globalIndex2?: IndexSchema
    globalIndex3?: IndexSchema
    globalIndex4?: IndexSchema
    globalIndex5?: IndexSchema
    localIndex1?: IndexSchema
    localIndex2?: IndexSchema
    localIndex3?: IndexSchema
    localIndex4?: IndexSchema
    localIndex5?: IndexSchema
}

export { defineTable } from './defineTable'
export { keySchema } from './keySchema'
export { globalIndex } from './globalIndex'
export { globalIndexes } from './globalIndexes'
export { localIndex } from './localIndex'
export { localIndexes } from './localIndexes'
