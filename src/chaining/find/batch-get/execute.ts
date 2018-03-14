import { DynamoDB } from 'aws-sdk'
import { batchGet, buildBatchGetInput} from '../../../database-operations/batch-get'
import { EntitySchema } from '../../../schema'
import { Chaining, Filter, Paginate, WithAttributes } from '../../common'
import { BatchGetChainingKind } from './'
import { BatchGet } from './batch-get'

function extractFromStack<KeySchema>(stack: Array<Chaining<BatchGetChainingKind>>): {
    batchGetMetadata: BatchGet<KeySchema>,
    withAttributes?: WithAttributes,
} {
    const batchGetMetadata = (stack[0] as any)._batchGet
    let withAttributes: WithAttributes | undefined
    for (const current of stack) {
        switch ((current as any)._kind) {
            case 'withAttributes': withAttributes = (current as any)._withAttributes
        }
    }
    return { batchGetMetadata, withAttributes }
}

export function execute<Entity, KeySchema>(
    stack: Array<Chaining<BatchGetChainingKind>>,
) {
    const { batchGetMetadata, withAttributes } = extractFromStack<KeySchema>(stack)
    const batchGetInput = buildBatchGetInput(batchGetMetadata, withAttributes)
    return batchGet<Entity, KeySchema>(
        batchGetMetadata.schema.tableName, batchGetInput, batchGetMetadata.schema.dynamoPromise,
    )
}
