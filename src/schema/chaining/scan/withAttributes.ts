import { EntitySchema } from '../../'
import Expression from '../filter/Expression'
import { allResults } from './allResults'
import { paginate } from './paginate'

export default class DynamoScanWithAttributes<
    Entity,
    KeySchema
> {

    private _entitySchema: EntitySchema
    private _attributes: string[]
    private _expression?: Expression

    constructor(
        entitySchema: EntitySchema,
        attributes: string[],
        expression?: Expression,
    ) {
        this._entitySchema = entitySchema
        this._attributes = attributes
        this._expression = expression
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return paginate<Entity, KeySchema>(this._entitySchema, limit, lastKey, this._expression, this._attributes)
    }

    public allResults() {
        return allResults<Entity, KeySchema>(this._entitySchema, this._expression, this._attributes)
    }

}

export function withAttributes<Entity, KeySchema, Attributes extends keyof Entity>(
    entitySchema: EntitySchema, attributes: Attributes[], expression?: Expression,
): DynamoScanWithAttributes<Pick<Entity, Attributes>, KeySchema> {
    return new DynamoScanWithAttributes<Pick<Entity, Attributes>, KeySchema>(entitySchema, attributes, expression)
}
