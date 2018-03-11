import { randomGenerator } from '../expressions/randomGenerator'
import { Chaining } from './'

export type WithAttributesType = 'withAttributes'

export interface WithAttributes {
    attributes: string[]
    expressionAttributeNames: {
        [key: string]: string,
    }
}

export abstract class CommonWithAttributes<ChainingKind> extends Chaining<ChainingKind | WithAttributesType> {

    protected _withAttributes: WithAttributes

    constructor(
        attributes: string[],
        currentStack: Array<Chaining<ChainingKind>>,
    ) {
        super('withAttributes', currentStack)
        this._withAttributes = this.generateExpressionAttributeNames(attributes)
        this._stack.push(this)
    }

    private generateExpressionAttributeNames(attrs: string[]) {
        const attributes = new Array<string>()
        const expressionAttributeNames = attrs.reduce((acc, value) => {
            const randomId = '#' + randomGenerator()
            acc[randomId] = value
            attributes.push(randomId)
            return acc
        }, {})
        return { attributes, expressionAttributeNames }
    }
}
