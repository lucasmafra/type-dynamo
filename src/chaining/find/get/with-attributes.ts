import { IGetResult } from '../../../database-operations/get'
import { Chaining, CommonWithAttributes } from '../../common'
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

    public execute(): Promise<IGetResult<Entity, KeySchema>> {
        return execute<Entity, KeySchema>(this._stack)
    }
}
