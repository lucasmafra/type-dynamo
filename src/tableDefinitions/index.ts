export interface ProvisionedThroughput {
    readCapacityUnits: number,
    writeCapacityUnits: number,
}

export interface GlobalIndex {
    indexName: string,
    partitionKey: string
    projectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE'
    provisionedThroughput: ProvisionedThroughput
    sortKey?: string
    attributes: Attribute[]
}

export interface LocalIndex {
    indexName: string,
    partitionKey: string
    projectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE'
    provisionedThroughput: ProvisionedThroughput
    sortKey?: string
    attributes: Attribute[]
}

export interface Attribute {
    name: string
    alias: string
}

export interface TimeToLive {
    attributeName: string
    enabled: boolean
}

export interface TableSchema {
    tableName: string,
    partitionKey: string
    sortKey?: string
    globalIndexes: GlobalIndex[]
    attributes: Attribute[]
    localIndexes: LocalIndex[]
    timeToLive?: TimeToLive
    provisionedThroughput: ProvisionedThroughput
}
