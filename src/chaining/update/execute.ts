import { DynamoDB } from 'aws-sdk'
import { buildUpdateInput, update, UpdateResult } from '../../operations/update'
import { EntitySchema } from '../../schema'
import { Chaining, WithCondition } from '../common'
import { UpdateChainingKind } from './'
import { Update } from './update'

function extractFromStack<Entity, KeySchema>(stack: Array<Chaining<UpdateChainingKind>>): {
    updateMetadata: Update<KeySchema>,
    withCondition?: WithCondition,
} {
    const updateMetadata = (stack[0] as any)._update
    let withCondition: WithCondition | undefined
    for (const current of stack) {
        switch ((current as any)._kind) {
            case 'withCondition': withCondition = (current as any)._withCondition
        }
    }
    return { updateMetadata, withCondition }
}

export function execute<Entity, KeySchema>(
    stack: Array<Chaining<UpdateChainingKind>>,
) {
    const { updateMetadata, withCondition } = extractFromStack<Entity, KeySchema>(stack)
    const updateInput = buildUpdateInput(updateMetadata, withCondition)
    return update<Entity>(updateInput, updateMetadata.schema.dynamoClient)
}
