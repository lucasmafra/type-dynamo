import { EntitySchema } from '../../'
import Expression from '../filter/Expression'
import { allResults } from './allResults'
import { paginate } from './paginate'
import { withAttributes } from './withAttributes'
export default class DynamoScanFilter<
    Entity,
    KeySchema
> {

    private _entitySchema: EntitySchema
    private _expression: Expression

    constructor(
        entitySchema: EntitySchema,
        expression: Expression,
    ) {
        this._entitySchema = entitySchema
        this._expression = expression
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return withAttributes<Entity, KeySchema, K>(this._entitySchema, attributes, this._expression)
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return paginate<Entity, KeySchema>(this._entitySchema, limit, lastKey, this._expression)
    }

    public allResults() {
        return allResults<Entity, KeySchema>(this._entitySchema, this._expression)
    }

}

export function filter<Entity, KeySchema>(
    entitySchema: EntitySchema, expression: Expression,
): DynamoScanFilter<Entity, KeySchema> {
    return new DynamoScanFilter<Entity, KeySchema>(entitySchema, expression)
}
