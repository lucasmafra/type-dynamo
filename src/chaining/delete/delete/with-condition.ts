import { Chaining, CommonWithCondition, WithCondition } from '../../common'
import { DeleteChainingKind } from './'
import { execute } from './execute'

export class DynamoDeleteWithCondition<
    Entity, KeySchema
> extends CommonWithCondition<DeleteChainingKind> {

    constructor(
        withCondition: WithCondition,
        currentStack: Array<Chaining<DeleteChainingKind>>,
    ) {
        super(withCondition, currentStack)
    }

    public execute() {
        return execute<Entity, KeySchema>(this._stack)
    }

}
