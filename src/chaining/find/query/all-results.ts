import { QueryResult } from '../../../database-operations/query'
import Expression from '../../../expressions/expression'
import { EntitySchema } from '../../../schema'
import { Chaining, CommonAllResults } from '../../common'
import { QueryChainingKind } from './'
import { executeAllResults } from './execute'

export class DynamoQueryAllResults<
    Entity,
    KeySchema
> extends CommonAllResults<QueryChainingKind> {

    constructor(
        currentStack: Array<Chaining<QueryChainingKind>>,
    ) {
        super(currentStack)
    }

    public execute() {
        return executeAllResults<Entity, KeySchema>(this._stack)
    }

}
