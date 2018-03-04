import { EntitySchema } from '../../'
import Expression from '../expressions/Expression'
import { randomGenerator } from '../expressions/randomGenerator'
import { allResults } from './allResults'
import { paginate } from './paginate'
export default class DynamoScanWithAttributes<
    Entity,
    KeySchema
> {

    private _entitySchema: EntitySchema
    private _attributes: string[]
    private _expression?: Expression
    private _expressionAttributeNames: {
        [key: string]: string,
    }

    constructor(
        entitySchema: EntitySchema,
        attributes: string[],
        expression?: Expression,
    ) {
        this._entitySchema = entitySchema
        this.generateExpressionAttributeNames(attributes)
        this._expression = expression

    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return paginate<Entity, KeySchema>(
            this._entitySchema, limit, lastKey, this._expression, {
                attributes: this._attributes,
                expressionAttributeNames: this._expressionAttributeNames,
            },
        )
    }

    public allResults() {
        return allResults<Entity, KeySchema>(
            this._entitySchema, this._expression, {
                attributes: this._attributes,
                expressionAttributeNames: this._expressionAttributeNames,
            },
        )
    }

    private generateExpressionAttributeNames(attributes: string[]) {
        this._attributes = new Array<string>()
        this._expressionAttributeNames = attributes.reduce((acc, value) => {
            const randomId = '#' + randomGenerator()
            acc[randomId] = value
            this._attributes.push(randomId)
            return acc
        }, {})
    }

}

export function withAttributes<Entity, KeySchema, Attributes extends keyof Entity>(
    entitySchema: EntitySchema, attributes: Attributes[], expression?: Expression,
): DynamoScanWithAttributes<Pick<Entity, Attributes>, KeySchema> {
    return new DynamoScanWithAttributes<Pick<Entity, Attributes>, KeySchema>(entitySchema, attributes, expression)
}
