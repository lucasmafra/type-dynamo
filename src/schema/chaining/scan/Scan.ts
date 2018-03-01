import { EntitySchema } from '../../'
import { allResults } from './allResults'
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

    public filter() {
        // return Scan<Entity, KeySchema>(this._entitySchema)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return withAttributes<Entity, KeySchema, K>(this._entitySchema, attributes)
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return paginate(this._entitySchema, limit, lastKey)
    }

    public allResults() {
        return allResults<Entity, KeySchema>(this._entitySchema)
    }

}
