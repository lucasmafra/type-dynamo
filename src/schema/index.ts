import DynamoClient from '../operations/dynamo-client'

export type ProjectionType = 'ALL' | 'INCLUDE' | 'KEYS_ONLY'

export interface EntitySchema {
    tableName: string
    tableSchema?: TableSchema,
    indexSchema?: IndexSchema
    dynamoClient: DynamoClient
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
