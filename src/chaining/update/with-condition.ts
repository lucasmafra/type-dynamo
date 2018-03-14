import { Chaining, CommonWithCondition, WithCondition } from '../common'
import { UpdateChainingKind } from './'
import { execute } from './execute'

export class DynamoUpdateWithCondition<
    Entity, KeySchema
> extends CommonWithCondition<UpdateChainingKind> {

    constructor(
        withCondition: WithCondition,
        currentStack: Array<Chaining<UpdateChainingKind>>,
    ) {
        super(withCondition, currentStack)
    }

    public execute() {
        return execute<Entity, KeySchema>(this._stack)
    }

}
