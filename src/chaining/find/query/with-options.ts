import { randomGenerator } from '../../../helpers/random-generator'
import { Chaining, CommonWithAttributes } from '../../common'
import { QueryChainingKind } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryPaginate } from './paginate'

export type WithOptionsType = 'withOptions'

export interface WithOptions {
    order?: 'ascending' | 'descending'
}

export class DynamoQueryWithOptions<
    Entity,
    KeySchema
> extends Chaining<QueryChainingKind> {

    private _withOptions: WithOptions

    constructor(
        currentStack: Array<Chaining<QueryChainingKind>>,
        withOptions: WithOptions,
    ) {
        super('withOptions', currentStack)
        this._withOptions = withOptions
        this._stack.push(this)
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return new DynamoQueryPaginate<Entity, KeySchema>(this._stack, { limit, lastKey})
    }

    public allResults() {
        return new DynamoQueryAllResults<Entity, KeySchema>(this._stack)
    }

}
