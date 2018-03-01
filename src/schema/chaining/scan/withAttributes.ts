import { EntitySchema } from '../../'
import { allResults } from './allResults'
import { paginate } from './paginate'

export default class DynamoScanWithAttributes<
    Entity,
    KeySchema
> {

    private _entitySchema: EntitySchema
    private _attributes: string[]

    constructor(
        entitySchema: EntitySchema,
        attributes: string[],
    ) {
        this._entitySchema = entitySchema
        this._attributes = attributes
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return paginate(this._entitySchema, limit, lastKey, this._attributes)
    }

    public allResults() {
        return allResults<Entity, KeySchema>(this._entitySchema, this._attributes)
    }

}

export function withAttributes<Entity, KeySchema, Attributes extends keyof Entity>(
    entitySchema: EntitySchema, attributes: Attributes[],
): DynamoScanWithAttributes<Pick<Entity, Attributes>, KeySchema> {
    return new DynamoScanWithAttributes<Pick<Entity, Attributes>, KeySchema>(entitySchema, attributes)
}
