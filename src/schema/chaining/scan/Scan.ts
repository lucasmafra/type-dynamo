import { EntitySchema } from '../../'
import Expression from '../filter/Expression'
import { allResults } from './allResults'
import { filter } from './filter'
import { paginate } from './paginate'
import { withAttributes } from './withAttributes'

export default class DynamoScan<
    Entity,
    KeySchema
> {

    private _entitySchema: EntitySchema

    constructor(
        entitySchema: EntitySchema,
    ) {
        this._entitySchema = entitySchema
    }

    public filter(expression: Expression) {
        return filter<Entity, KeySchema>(this._entitySchema, expression)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return withAttributes<Entity, KeySchema, K>(this._entitySchema, attributes)
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return paginate<Entity, KeySchema>(this._entitySchema, limit, lastKey)
    }

    public allResults() {
        return allResults<Entity, KeySchema>(this._entitySchema)
    }

}
