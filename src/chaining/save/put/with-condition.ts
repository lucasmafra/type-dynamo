import { PutResult } from '../../../operations/put'
import { Chaining, CommonWithCondition, WithCondition } from '../../common'
import { PutChainingKind } from './'
import { execute } from './execute'

export class DynamoPutWithCondition<
    Entity
> extends CommonWithCondition<PutChainingKind> {

    constructor(
        withCondition: WithCondition,
        currentStack: Array<Chaining<PutChainingKind>>,
    ) {
        super(withCondition, currentStack)
    }

    public execute() {
        return execute<Entity>(this._stack)
    }

}
