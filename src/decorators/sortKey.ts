import { hiddenProperty } from './constants'

export default function(): (target: any, propertyKey: string) => void {
    return (target: any, propertyKey: string) => {
        target[hiddenProperty] = target[hiddenProperty] || {}
        target[hiddenProperty].sortKey = propertyKey
    }
}
