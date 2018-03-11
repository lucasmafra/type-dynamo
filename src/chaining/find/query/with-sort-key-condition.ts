import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import Expression from '../../expressions/Expression'
import {
    BeginsWith, IsBetween, IsEqualTo, IsGreaterOrEqualTo, IsGreaterThan, IsLessOrEqualTo, IsLessThan,
    Operator,
 } from '../../expressions/Operator'
import { randomGenerator } from '../../expressions/randomGenerator'
import { QueryChainingKind } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryFilter } from './filter'
import { DynamoQueryPaginate } from './paginate'
import { DynamoQueryWithAttributes } from './with-attributes'

export type WithSortKeyConditionType = 'withSortKeyCondition'

export interface WithSortKeyCondition {
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

export class DynamoWithSortKeyCondition<
    Entity,
    KeySchema
> extends Chaining<QueryChainingKind> {

    private _withSortKeyCondition: WithSortKeyCondition

    constructor(
        schema: EntitySchema,
        operator: SortKeyConditionOperator,
        currentStack: Array<Chaining<QueryChainingKind>>,
    ) {
        super('withSortKeyCondition', currentStack)
        this._withSortKeyCondition = this.buildSortKeyCondition(schema, operator)
        this._stack.push(this)
    }

    public filter(filterExpression: Expression) {
        return new DynamoQueryFilter<Entity, KeySchema>(filterExpression, this._stack)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return new DynamoQueryWithAttributes<Pick<Entity, K>, KeySchema>(
            attributes, this._stack,
        )
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return new DynamoQueryPaginate<Entity, KeySchema>(this._stack, { limit, lastKey})
    }

    public allResults() {
        return new DynamoQueryAllResults<Entity, KeySchema>(this._stack)
    }

    private buildSortKeyCondition(schema: EntitySchema, sortKeyConditionOperator: SortKeyConditionOperator) {
        let expression: string
        const sortKey = schema.tableSchema ? schema.tableSchema.sortKey! : schema.indexSchema!.sortKey!
        const randomId = '#' + randomGenerator()
        if (sortKeyConditionOperator.type === 'function') {
            expression = sortKeyConditionOperator.value +
                `(${randomId},${sortKeyConditionOperator.functionOperand})`
        } else {
            expression = randomId + ' ' + sortKeyConditionOperator.value
        }
        const expressionAttributeNames = {
            [randomId]: sortKey,
        }
        const expressionAttributeValues = sortKeyConditionOperator.expressionAttributeValues
        return { expression, expressionAttributeNames, expressionAttributeValues }
    }

}
