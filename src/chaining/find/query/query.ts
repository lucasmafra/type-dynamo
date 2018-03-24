import Expression from '../../../expressions/expression'
import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import { QueryChainingKind } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryFilter } from './filter'
import { DynamoQueryPaginate } from './paginate'
import { DynamoQueryWithAttributes } from './with-attributes'
import { DynamoQueryWithOptions, WithOptions } from './with-options'
import { DynamoWithSortKeyCondition, SortKeyConditionOperator, WithSortKeyCondition } from './with-sort-key-condition'

export type QueryType = 'query'

export interface Query<PartitionKey> {
    schema: EntitySchema,
    partitionKey: PartitionKey
}

export class DynamoQuery<
    Entity,
    PartitionKey,
    SortKey,
    KeySchema
> extends Chaining<QueryChainingKind> {

    protected _query: Query<PartitionKey>

    constructor(
        query: Query<PartitionKey>,
    ) {
        super('query')
        this._query = query
        this._stack.push(this)
    }

    public withSortKeyCondition(operator: SortKeyConditionOperator) {
        return new DynamoWithSortKeyCondition<Entity, KeySchema>(this._query.schema, operator, this._stack)
    }

    public filter(filterExpression: Expression) {
        return new DynamoQueryFilter<Entity, KeySchema>({ filterExpression }, this._stack)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return new DynamoQueryWithAttributes<Pick<Entity, K>, KeySchema>(
            attributes, this._stack,
        )
    }

    public withOptions(options: WithOptions) {
        return new DynamoQueryWithOptions<Entity, KeySchema>(this._stack, options)
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return new DynamoQueryPaginate<Entity, KeySchema>(this._stack, { limit, lastKey})
    }

    public allResults() {
        return new DynamoQueryAllResults<Entity, KeySchema>(this._stack)
    }

}
