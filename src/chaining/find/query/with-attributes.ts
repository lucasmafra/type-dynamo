import { randomGenerator } from '../../../expressions/random-generator'
import { Chaining, CommonWithAttributes } from '../../common'
import { QueryChainingKind } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryPaginate } from './paginate'

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

    public paginate(limit?: number, lastKey?: KeySchema) {
        return new DynamoQueryPaginate<Entity, KeySchema>(this._stack, { limit, lastKey})
    }

    public allResults() {
        return new DynamoQueryAllResults<Entity, KeySchema>(this._stack)
    }

}
