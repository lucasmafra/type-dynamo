import { randomGenerator } from '../../../helpers/random-generator'
import { Chaining, CommonWithAttributes } from '../../common'
import { QueryChainingKind } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryPaginate } from './paginate'
import { DynamoQueryWithOptions, WithOptions } from './with-options'

export class DynamoQueryWithAttributes<
    Entity,
    KeySchema
> extends CommonWithAttributes<QueryChainingKind> {

    constructor(
        attributes: string[],
        currentStack: Array<Chaining<QueryChainingKind>>,
    ) {
        super(attributes, currentStack)
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
