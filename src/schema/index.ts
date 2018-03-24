import DynamoPromise from '../database-operations/dynamo-to-promise'

export type ProjectionType = 'ALL' | 'INCLUDE' | 'KEYS_ONLY'

export interface EntitySchema {
    tableName: string
    tableSchema?: TableSchema,
    indexSchema?: IndexSchema
    dynamoPromise: DynamoPromise
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

export { TypeDynamo } from './type-dynamo'
