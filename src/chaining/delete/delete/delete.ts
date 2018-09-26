import { DeleteResult } from '../../../operations/delete'
import Expression from '../../../expressions/expression'
import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import { DeleteChainingKind } from './'
import { execute } from './execute'
import { DynamoDeleteWithCondition } from './with-condition'

export type DeleteType = 'delete'

export interface Delete<Entity, KeySchema> {
    schema: EntitySchema,
    key: KeySchema,
}

export class DynamoDelete<Entity, KeySchema> extends Chaining<DeleteChainingKind> {

    protected _delete: Delete<Entity, KeySchema>

    constructor(
        deleteMetadata: Delete<Entity, KeySchema>,
    ) {
        super('delete')
        this._delete = deleteMetadata
        this._stack.push(this)
    }

    public withCondition(expression: Expression) {
        return new DynamoDeleteWithCondition<Entity, KeySchema>({ expression }, this._stack)
    }

    public execute() {
        return execute<Entity, KeySchema>(this._stack)
    }

}
