import { EntitySchema } from '../../../schema'
import { Chaining, CommonAllResults } from '../../common'
import Expression from '../../expressions/Expression'
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
