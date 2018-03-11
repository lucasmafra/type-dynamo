import { Chaining, CommonWithAttributes } from '../../common'
import { randomGenerator } from '../../expressions/randomGenerator'
import { GetChainingKind } from './'
import { execute } from './execute'

export class DynamoGetWithAttributes<
    Entity,
    KeySchema
> extends CommonWithAttributes<GetChainingKind> {

    constructor(
        attributes: string[],
        currentStack: Array<Chaining<GetChainingKind>>,
    ) {
        super(attributes, currentStack)
    }

    public execute() {
        return execute<Entity, KeySchema>(this._stack)
    }

}
