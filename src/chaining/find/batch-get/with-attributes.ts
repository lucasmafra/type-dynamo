import { IBatchGetResult } from '../../../database-operations/batch-get'
import { randomGenerator } from '../../../expressions/random-generator'
import { Chaining, CommonWithAttributes } from '../../common'
import { BatchGetChainingKind } from './'
import { execute } from './execute'

export class DynamoGetWithAttributes<
    Entity,
    KeySchema
> extends CommonWithAttributes<BatchGetChainingKind> {

    constructor(
        attributes: string[],
        currentStack: Array<Chaining<BatchGetChainingKind>>,
    ) {
        super(attributes, currentStack)
    }

    public execute() {
        return execute<Entity, KeySchema>(this._stack)
    }
}
