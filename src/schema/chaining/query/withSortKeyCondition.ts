import { EntitySchema } from '../../'
import Expression from '../expressions/Expression'
import {
    BeginsWith, IsBetween, IsEqualTo, IsGreaterOrEqualTo, IsGreaterThan, IsLessOrEqualTo, IsLessThan,
    Operator,
 } from '../expressions/Operator'
import { randomGenerator } from '../expressions/randomGenerator'
import { allResults } from './allResults'
import { filter } from './filter'
import { paginate } from './paginate'
import { withAttributes } from './withAttributes'

export interface SortKeyCondition {
    expression: string,
    expressionAttributeNames: {
        [key: string]: string,
    },
    expressionAttributeValues: {
        [key: string]: {
            [key: string]: string | number,
        },
    },
}
export type SortKeyConditionOperator =
    BeginsWith | IsEqualTo | IsGreaterThan | IsLessThan | IsLessOrEqualTo | IsGreaterOrEqualTo
    | IsBetween

export default class DynamoWithSortKeyCondition<
    Entity,
    PartitionKey,
    SortKey
> {

    private _entitySchema: EntitySchema
    private _partitionKey: PartitionKey
    private _sortKeyConditionOperator: SortKeyConditionOperator
    private _sortKeyCondition: SortKeyCondition

    constructor(
        entitySchema: EntitySchema,
        partitionKey: PartitionKey,
        sortKeyConditionOperator: SortKeyConditionOperator,
    ) {
        this._entitySchema = entitySchema
        this._partitionKey = partitionKey
        this._sortKeyConditionOperator = sortKeyConditionOperator
        this.buildSortKeyCondition(this._sortKeyConditionOperator)
    }

    public filter(expression: Expression) {
        return filter<Entity, PartitionKey, SortKey>(
            this._entitySchema, this._partitionKey, expression, this._sortKeyCondition,
        )
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return withAttributes<Entity, PartitionKey, SortKey, K>(
            this._entitySchema, attributes, this._partitionKey, undefined, this._sortKeyCondition,
        )
    }

    public paginate(limit?: number, lastKey?: PartitionKey & SortKey) {
        return paginate<Entity, PartitionKey, SortKey>(
            this._entitySchema, limit, this._partitionKey, lastKey, undefined, this._sortKeyCondition,
        )
    }

    public allResults() {
        return allResults<Entity, PartitionKey, SortKey>(
            this._entitySchema, this._partitionKey, undefined, this._sortKeyCondition,
        )
    }

    private buildSortKeyCondition(sortKeyConditionOperator: SortKeyConditionOperator) {
        this._sortKeyCondition = {} as any
        const sortKey = this._entitySchema.tableSchema ? this._entitySchema.tableSchema.sortKey! :
             this._entitySchema.indexSchema!.sortKey!
        const randomId = '#' + randomGenerator()
        if (sortKeyConditionOperator.type === 'function') {
            this._sortKeyCondition.expression = sortKeyConditionOperator.value +
                `(${randomId},${sortKeyConditionOperator.functionOperand})`
        } else {
            this._sortKeyCondition.expression = randomId + ' ' + sortKeyConditionOperator.value
        }
        this._sortKeyCondition.expressionAttributeNames = {
            [randomId]: sortKey,
        }
        this._sortKeyCondition.expressionAttributeValues = sortKeyConditionOperator.expressionAttributeValues
    }

}

export function withSortKeyCondition<Entity, PartitionKey, SortKey>(
    entitySchema: EntitySchema, partitionKey: PartitionKey, sortKeyConditionOperator: SortKeyConditionOperator,
): DynamoWithSortKeyCondition<Entity, PartitionKey, SortKey> {
    return new DynamoWithSortKeyCondition<Entity, PartitionKey, SortKey>(
        entitySchema, partitionKey, sortKeyConditionOperator,
    )
}
