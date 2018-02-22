import { hiddenProperty } from './constants'

export default function(alias?: string): (target: any, propertyKey: string) => void {
    return (target: any, propertyKey: string) => {
        target[propertyKey] = target[propertyKey] || undefined
        target[hiddenProperty] = target[hiddenProperty] || {}
        target[hiddenProperty].attributes = target[hiddenProperty].attributes || []
        target[hiddenProperty].attributes.push({
            name: propertyKey,
            alias: alias || propertyKey,
        })
    }
}
