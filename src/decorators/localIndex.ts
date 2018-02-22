import { LocalIndex, ProvisionedThroughput } from '../tableDefinitions'
import { hiddenProperty } from './constants'

export default function(indexName: string, partitionKey: string, projectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE',
                        provisionedThroughput: ProvisionedThroughput, sortKey?: string,
                        attributes?: string[]): (target: any) => void {
    return (target: any) => {
        if (!target.prototype) {
            target.prototype = {}
        }
        target.prototype[hiddenProperty] = target.prototype[hiddenProperty] || {}
        target.prototype[hiddenProperty].localIndexes = target.prototype[hiddenProperty].localIndexes ||
        new Array<LocalIndex>()
        const object = {
            indexName, partitionKey, projectionType, provisionedThroughput, sortKey,
        }
        if (attributes) {
            target.prototype[hiddenProperty].localIndexes.push({ ...object, attributesName: attributes })
        } else {
            target.prototype[hiddenProperty].localIndexes.push(object)
        }

    }
}
