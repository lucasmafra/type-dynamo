import { BatchWriteResult } from '../../../database-operations/batch-write'
import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import { BatchWriteChainingKind } from './'
import { execute } from './execute'

export type BatchWriteType = 'batchWrite'

export interface BatchWrite<Table> {
    schema: EntitySchema,
    items: Table[],
}

export class DynamoBatchWrite<Entity> extends Chaining<BatchWriteChainingKind> {

    protected _batchWrite: BatchWrite<Entity>

    constructor(
        batchWrite: BatchWrite<Entity>,
    ) {
        super('batchWrite')
        this._batchWrite = batchWrite
        this._stack.push(this)
    }

    public execute() {
        return execute<Entity>(this._stack)
    }

}
