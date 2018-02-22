import { hiddenProperty } from '../decorators'
import { Attribute, TableSchema } from '../tableDefinitions'

abstract class DynamoTable {

    private _tableSchema: TableSchema

    constructor() {
        if (!this[hiddenProperty].globalIndexes) {
            this[hiddenProperty] = {} as any
        }
        if (!this[hiddenProperty].localIndexes) {
            this[hiddenProperty].localIndexes = new Array()
        }
        for (const index of this[hiddenProperty].globalIndexes) {
            if (index.projectionType === 'ALL') {
                index.attributes = this[hiddenProperty].attributes
            } else {
                index.attributes = new Array<Attribute>()
                index.attributes.push({
                    name: index.partitionKey,
                    alias: this[hiddenProperty].attributes.find((a: Attribute) =>
                        a.name === index.partitionKey)!.alias,
                })
                if (index.sortKey) {
                    index.attributes.push({
                        name: index.sortKey,
                        alias: this[hiddenProperty].attributes.find((a: Attribute) =>
                            a.name === index.sortKey)!.alias,
                    })
                }
                if (index.projectionType === 'INCLUDE') {
                    for (const attr of (index as any).attributesName) {
                        index.attributes.push({
                            name: attr,
                            alias: this[hiddenProperty].attributes.find((a: Attribute) =>
                                a.name === attr)!.alias,
                        })
                    }
                }
            }
            delete (index as any).attributesName
        }
        if (hiddenProperty !== '_tableSchema') {
            this._tableSchema = Object.assign({}, this[hiddenProperty])
            delete this[hiddenProperty]
        }
    }

    public getTableSchema(): TableSchema {
        return this._tableSchema
    }
}

export default DynamoTable
