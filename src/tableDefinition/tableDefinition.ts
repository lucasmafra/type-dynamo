export interface ProvisionedThroughput {
    ReadCapacityUnits: number,
    WriteCapacityUnits: number,
}

export interface GlobalIndexDefinition {
    indexName: string,
    partitionKey: string
    projectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE'
    provisionedThroughput: ProvisionedThroughput
    rangeKey?: string
    attributes: AttributeDefinition[]
}

export interface LocalIndexDefinition {
    indexName: string,
    partitionKey: string
    projectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE'
    provisionedThroughput: ProvisionedThroughput
    rangeKey?: string
    attributes: AttributeDefinition[]
}

export interface AttributeDefinition {
    name: string
    alias: string
}

export interface TimeToLiveDefinition {
    attributeName: string
    enabled: boolean
}

export interface TableDefinition {
    tableName: string,
    partitionKey: string
    rangeKey?: string
    globalIndexes: GlobalIndexDefinition[]
    attributes: AttributeDefinition[]
    localIndexes: LocalIndexDefinition[]
    timeToLive?: TimeToLiveDefinition
    provisionedThroughput: ProvisionedThroughput
}
