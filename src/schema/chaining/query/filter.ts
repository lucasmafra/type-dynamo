import { EntitySchema } from '../../'
import Expression from '../expressions/Expression'
import { allResults } from './allResults'
import { paginate } from './paginate'
import { withAttributes } from './withAttributes'
import { SortKeyCondition } from './withSortKeyCondition'

export default class DynamoQueryFilter<
    Entity,
    PartitionKey,
    SortKey
> {

    private _entitySchema: EntitySchema
    private _expression: Expression
    private _partitionKey: PartitionKey
    private _sortKeyCondition?: SortKeyCondition

    constructor(
        entitySchema: EntitySchema,
        partitionKey: PartitionKey,
        expression: Expression,
        sortKeyCondition?: SortKeyCondition,
    ) {
        this._entitySchema = entitySchema
        this._partitionKey = partitionKey
        this._expression = expression
        this._sortKeyCondition = sortKeyCondition
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return withAttributes<Entity, PartitionKey, SortKey, K>(
            this._entitySchema, attributes, this._partitionKey, this._expression, this._sortKeyCondition,
        )
    }

    public paginate(limit?: number, lastKey?: PartitionKey & SortKey) {
        return paginate<Entity, PartitionKey, SortKey>(
            this._entitySchema, limit, this._partitionKey, lastKey, this._expression, this._sortKeyCondition,
        )
    }

    public allResults() {
        return allResults<Entity, PartitionKey, SortKey>(
            this._entitySchema, this._partitionKey, this._expression, this._sortKeyCondition,
        )
    }

}

export function filter<Entity, PartitionKey, SortKey>(
    entitySchema: EntitySchema, partitionKey: PartitionKey, expression: Expression, sortKeyCondition?: SortKeyCondition,
): DynamoQueryFilter<Entity, PartitionKey, SortKey> {
    return new DynamoQueryFilter<Entity, PartitionKey, SortKey>(
        entitySchema, partitionKey, expression,
    )
}
