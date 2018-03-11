import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import { BatchGetChainingKind } from './'
import { execute } from './execute'
import { DynamoGetWithAttributes } from './with-attributes'

export type BatchGetType = 'batchGet'

export interface BatchGet<KeySchema> {
    schema: EntitySchema,
    keys: KeySchema[],
}

export class DynamoBatchGet<
    Entity,
    KeySchema
> extends Chaining<BatchGetChainingKind> {

    protected _batchGet: BatchGet<KeySchema>

    constructor(
        batchGet: BatchGet<KeySchema>,
    ) {
        super('batchGet')
        this._batchGet = batchGet
        this._stack.push(this)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return new DynamoGetWithAttributes<Pick<Entity, K>, KeySchema>(
            attributes, this._stack,
        )
    }

    public execute() {
        return execute<Entity, KeySchema>(this._stack)
    }

}
