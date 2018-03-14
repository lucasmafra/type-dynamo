import { DynamoDB } from 'aws-sdk'
import { buildPutInput, put } from '../../../database-operations/put'
import { EntitySchema } from '../../../schema'
import { Chaining, WithCondition } from '../../common'
import { PutChainingKind } from './'
import { Put } from './put'

function extractFromStack<Entity>(stack: Array<Chaining<PutChainingKind>>): {
    putMetadata: Put<Entity>,
    withCondition?: WithCondition,
} {
    const putMetadata = (stack[0] as any)._put
    let withCondition: WithCondition | undefined
    for (const current of stack) {
        switch ((current as any)._kind) {
            case 'withCondition': withCondition = (current as any)._withCondition
        }
    }
    return { putMetadata, withCondition }
}

export function execute<Entity>(
    stack: Array<Chaining<PutChainingKind>>,
) {
    const { putMetadata, withCondition } = extractFromStack<Entity>(stack)
    const putInput = buildPutInput(putMetadata, withCondition)
    return put<Entity>(putMetadata.item, putInput, putMetadata.schema.dynamoPromise)
}
