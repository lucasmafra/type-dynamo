import { PutResult } from '../../../operations/put'
import Expression from '../../../expressions/expression'
import { IEntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import { PutChainingKind } from './'
import { execute } from './execute'
import { DynamoPutWithCondition } from './with-condition'

export type PutType = 'put'

export interface Put<Entity> {
    schema: IEntitySchema,
    item: Entity,
}

export class DynamoPut<
    Entity
> extends Chaining<PutChainingKind> {

    protected _put: Put<Entity>

    constructor(
        put: Put<Entity>,
    ) {
        super('put')
        this._put = put
        this._stack.push(this)
    }

    public withCondition(expression: Expression) {
        return new DynamoPutWithCondition<Entity>({ expression }, this._stack)
    }

    public execute() {
        return execute<Entity>(this._stack)
    }

}
