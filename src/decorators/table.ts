import { ProvisionedThroughput } from '../tableDefinitions'
import { hiddenProperty } from './constants'

export default function(tableName: string, provisionedThroughput: ProvisionedThroughput, timeToLive?: string)
: (target: any) => void  {
    return (target: any) => {
        if (!target.prototype) {
            target.prototype = {}
        }
        target.prototype[hiddenProperty] = target.prototype[hiddenProperty] || {}
        target.prototype[hiddenProperty].tableName = tableName
        target.prototype[hiddenProperty].timeToLive = timeToLive
        target.prototype[hiddenProperty].provisionedThroughput = provisionedThroughput
    }
}
