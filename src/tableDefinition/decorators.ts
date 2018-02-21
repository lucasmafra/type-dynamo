import {
    AttributeDefinition, GlobalIndexDefinition, LocalIndexDefinition, ProvisionedThroughput,
 } from './tableDefinition'

export function table(tableName: string, provisionedThroughput: ProvisionedThroughput, timeToLive?: string)  {
    return (target: any) => {
        target.prototype.tableDefinition = target.tableDefinition || {}
        target.prototype.tableDefinition.tableName = tableName
        target.prototype.tableDefinition.timeToLive = timeToLive
        target.prototype.tableDefinition.provisionedThroughput = provisionedThroughput
    }
}

export function globalIndex(indexName: string, primaryKey: string, projectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE',
                            provisionedThroughput: ProvisionedThroughput, sortKey?: string,
                            attributes?: string[]): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        target.tableDefinition = target.tableDefinition || {}
        target.tableDefinition.globalIndexes = target.tableDefinition.globalIndexes ||
            new Array<GlobalIndexDefinition>()
        target.tableDefinition.globalIndexes.push({
            indexName, primaryKey, projectionType, provisionedThroughput, sortKey, attributesKey: attributes,
        })
    }
}

export function localIndex(indexName: string, primaryKey: string, projectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE',
                           provisionedThroughput: ProvisionedThroughput, sortKey?: string,
                           attributes?: string[]): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        target.tableDefinition = target.tableDefinition || {}
        target.tableDefinition.localIndexes = target.tableDefinition.localIndexes ||
        new Array<LocalIndexDefinition>()
        target.tableDefinition.localIndexes.push({
            indexName, primaryKey, projectionType, provisionedThroughput, sortKey, attributesKey: attributes,
        })
    }
}

export function partitionKey(): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        target.partitionKey = propertyKey
    }
}

export function rangeKey(): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        target.rangeKey = propertyKey
    }
}

export function attribute(name?: string): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        target[propertyKey] = undefined
        target.attributes = target.attributes || new Array<AttributeDefinition>()
        target.attributes.push({name: name || propertyKey, alias: propertyKey})
    }
}
