import { DynamoDB } from 'aws-sdk'
import { buildDeleteInput, deleteItem, DeleteResult } from '../../../database-operations/delete'
import { EntitySchema } from '../../../schema'
import { Chaining, WithCondition } from '../../common'
import { DeleteChainingKind } from './'
import { Delete } from './delete'

function extractFromStack<Entity, KeySchema>(stack: Array<Chaining<DeleteChainingKind>>): {
    deleteMetadata: Delete<Entity, KeySchema>,
    withCondition?: WithCondition,
} {
    const deleteMetadata = (stack[0] as any)._delete
    let withCondition: WithCondition | undefined
    for (const current of stack) {
        switch ((current as any)._kind) {
            case 'withCondition': withCondition = (current as any)._withCondition
        }
    }
    return { deleteMetadata, withCondition }
}

export function execute<Entity, KeySchema>(
    stack: Array<Chaining<DeleteChainingKind>>,
) {
    const { deleteMetadata, withCondition } = extractFromStack<Entity, KeySchema>(stack)
    const deleteInput = buildDeleteInput(deleteMetadata, withCondition)
    return deleteItem<Entity>(deleteInput, deleteMetadata.schema.dynamoPromise)
}
