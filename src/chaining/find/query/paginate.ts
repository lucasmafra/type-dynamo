import { IQueryResult } from '../../../database-operations/query'
import { Chaining, CommonPaginate, Paginate } from '../../common'
import { QueryChainingKind } from './'
import { executePaginate } from './execute'

export class DynamoQueryPaginate<
    Entity,
    KeySchema
> extends CommonPaginate<QueryChainingKind, KeySchema> {

    constructor(
        currentStack: Array<Chaining<QueryChainingKind>>,
        paginate?: Paginate<KeySchema>,
    ) {
        super(currentStack, paginate)
    }

    public execute() {
        return executePaginate<Entity, KeySchema>(this._stack)
    }

}
