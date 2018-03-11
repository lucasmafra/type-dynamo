import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import Expression from '../../expressions/Expression'
import { QueryChainingKind } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryFilter } from './filter'
import { DynamoQueryPaginate } from './paginate'
import { DynamoQueryWithAttributes } from './with-attributes'
import { DynamoWithSortKeyCondition, SortKeyConditionOperator, WithSortKeyCondition } from './with-sort-key-condition'

export type QueryType = 'query'

export interface Query<PartitionKey> {
    schema: EntitySchema,
    partitionKey: PartitionKey
}

export class DynamoQuery<
    Entity,
    PartitionKey,
    SortKey
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
        return new DynamoWithSortKeyCondition<Entity, PartitionKey, SortKey>(this._query.schema, operator, this._stack)
    }

    public filter(filterExpression: Expression) {
        return new DynamoQueryFilter<Entity, PartitionKey & SortKey>(filterExpression, this._stack)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return new DynamoQueryWithAttributes<Pick<Entity, K>, PartitionKey & SortKey>(
            attributes, this._stack,
        )
    }

    public paginate(limit?: number, lastKey?: PartitionKey & SortKey) {
        return new DynamoQueryPaginate<Entity, PartitionKey & SortKey>(this._stack, { limit, lastKey})
    }

    public allResults() {
        return new DynamoQueryAllResults<Entity, PartitionKey & SortKey>(this._stack)
    }

}
