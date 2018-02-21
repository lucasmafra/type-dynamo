import { AttributeDefinition } from './tableDefinition'
import { TableDefinition } from './tableDefinition'

export abstract class DynamoTable {

    public tableDefinition: TableDefinition

    constructor() {
        if (!this.tableDefinition.globalIndexes) {
            this.tableDefinition.globalIndexes = new Array()
        }
        if (!this.tableDefinition.localIndexes) {
            this.tableDefinition.localIndexes = new Array()
        }
        for (const index of this.tableDefinition.globalIndexes) {
            if (index.projectionType === 'ALL') {
                index.attributes = Object.getPrototypeOf(this).attributes
            } else {
                index.attributes = new Array<AttributeDefinition>()
                index.attributes.push({
                    alias: index.partitionKey,
                    name: Object.getPrototypeOf(this).attributes.find((a: AttributeDefinition) =>
                        a.alias === index.partitionKey)!.name,
                })
                if (index.rangeKey) {
                    index.attributes.push({
                        alias: index.rangeKey,
                        name: Object.getPrototypeOf(this).attributes.find((a: AttributeDefinition) =>
                            a.alias === index.rangeKey)!.name,
                    })
                }
                if (index.projectionType === 'INCLUDE') {
                    for (const attr of Object.getPrototypeOf(this.tableDefinition).attributesKey) {
                        index.attributes.push({
                            alias: attr,
                            name: Object.getPrototypeOf(this).attributes.find((a: AttributeDefinition) =>
                                a.alias === attr)!.name,
                        })
                    }
                }
            }
            delete (index as any).attributesKey
        }
        for (const index of this.tableDefinition.localIndexes) {
            if (index.projectionType === 'ALL') {
                index.attributes = Object.getPrototypeOf(this).attributes
            } else {
                index.attributes = new Array<AttributeDefinition>()
                index.attributes.push({
                    alias: index.partitionKey,
                    name: Object.getPrototypeOf(this).attributes.find((a: AttributeDefinition) =>
                        a.alias === index.partitionKey)!.name,
                })
                if (index.rangeKey) {
                    index.attributes.push({
                        alias: index.rangeKey,
                        name: Object.getPrototypeOf(this).attributes.find((a: AttributeDefinition) =>
                            a.alias === index.rangeKey)!.name,
                    })
                }
                if (index.projectionType === 'INCLUDE') {
                    for (const attr of Object.getPrototypeOf(this.tableDefinition).attributesKey) {
                        index.attributes.push({
                            alias: attr,
                            name: Object.getPrototypeOf(this).attributes.find((a: AttributeDefinition) =>
                                a.alias === attr)!.name,
                        })
                    }
                }
            }
            delete (index as any).attributesKey
        }

    }

    public getTableDefinition(): TableDefinition {
        return this.tableDefinition
    }
}
