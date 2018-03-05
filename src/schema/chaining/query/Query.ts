import { EntitySchema } from '../../'
import Expression from '../expressions/Expression'
import { Operator } from '../expressions/Operator'
import { allResults } from './allResults'
import { filter } from './filter'
import { paginate } from './paginate'
import { withAttributes } from './withAttributes'

interface SortKeyConditionOperator extends Operator {
    kind: 'beginsWith' | 'isEqualTo' | 'isGreatherThan' | 'isLessThan' | 'isLessOrEqualTo'
    | 'isGreatherOrEqualTo' | 'isBetween'
}

export default class DynamoQuery<
    Entity,
    PartitionKey,
    SortKey
> {

    private _entitySchema: EntitySchema
    private _partitionKey: PartitionKey

    constructor(
        entitySchema: EntitySchema,
        partitionKey: PartitionKey,
    ) {
        this._entitySchema = entitySchema
        this._partitionKey = partitionKey
    }

    public withSortKeyCondition(sortKeyConditionOperator: SortKeyConditionOperator) {
        // return allResults<Entity, PartitionKey & SortKey>(this._entitySchema)
    }

    public filter(expression: Expression) {
        return filter<Entity, PartitionKey, SortKey>(this._entitySchema, this._partitionKey, expression)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return withAttributes<Entity, PartitionKey, SortKey, K>(this._entitySchema, attributes, this._partitionKey)
    }

    public paginate(limit?: number, lastKey?: PartitionKey & SortKey) {
        return paginate<Entity, PartitionKey, SortKey>(this._entitySchema, limit, this._partitionKey, lastKey)
    }

    public allResults() {
        return allResults<Entity, PartitionKey, SortKey>(this._entitySchema, this._partitionKey)
    }

}
