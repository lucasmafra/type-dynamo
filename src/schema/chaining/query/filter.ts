import { EntitySchema } from '../../'
import Expression from '../expressions/Expression'
import { allResults } from './allResults'
import { paginate } from './paginate'
import { withAttributes } from './withAttributes'

export default class DynamoQueryFilter<
    Entity,
    PartitionKey,
    SortKey
> {

    private _entitySchema: EntitySchema
    private _expression: Expression
    private _partitionKey: PartitionKey

    constructor(
        entitySchema: EntitySchema,
        partitionKey: PartitionKey,
        expression: Expression,
    ) {
        this._entitySchema = entitySchema
        this._partitionKey = partitionKey
        this._expression = expression
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return withAttributes<Entity, PartitionKey, SortKey, K>(
            this._entitySchema, attributes, this._partitionKey, this._expression,
        )
    }

    public paginate(limit?: number, lastKey?: PartitionKey & SortKey) {
        return paginate<Entity, PartitionKey, SortKey>(
            this._entitySchema, limit, this._partitionKey, lastKey, this._expression,
        )
    }

    public allResults() {
        return allResults<Entity, PartitionKey, SortKey>(
            this._entitySchema, this._partitionKey, this._expression,
        )
    }

}

export function filter<Entity, PartitionKey, SortKey>(
    entitySchema: EntitySchema, partitionKey: PartitionKey, expression: Expression,
): DynamoQueryFilter<Entity, PartitionKey, SortKey> {
    return new DynamoQueryFilter<Entity, PartitionKey, SortKey>(
        entitySchema, partitionKey, expression,
    )
}
