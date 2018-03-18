import { BatchDeleteResult } from '../../../database-operations/batch-delete'
import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import { BatchDeleteChainingKind } from './'
import { execute } from './execute'

export type BatchDeleteType = 'batchDelete'

export interface BatchDelete<KeySchema> {
    schema: EntitySchema,
    keys: KeySchema[],
}

export class DynamoBatchDelete<Entity> extends Chaining<BatchDeleteChainingKind> {

    protected _batchDelete: BatchDelete<Entity>

    constructor(
        batchDelete: BatchDelete<Entity>,
    ) {
        super('batchDelete')
        this._batchDelete = batchDelete
        this._stack.push(this)
    }

    public execute() {
        return execute<Entity>(this._stack)
    }

}
