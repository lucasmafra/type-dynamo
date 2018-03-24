import { Chaining, CommonFilter, Filter } from '../../common'
import { QueryChainingKind } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryPaginate } from './paginate'
import { DynamoQueryWithAttributes } from './with-attributes'
import { DynamoQueryWithOptions, WithOptions } from './with-options'

export class DynamoQueryFilter<
    Entity,
    KeySchema
> extends CommonFilter<QueryChainingKind> {

    constructor(
        filter: Filter,
        currentStack: Array<Chaining<QueryChainingKind>>,
    ) {
        super(filter, currentStack)
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
