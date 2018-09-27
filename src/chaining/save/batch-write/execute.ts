import { DynamoDB } from 'aws-sdk'
import { batchWrite, BatchWriteResult, buildBatchWriteInput } from '../../../operations/batch-write'
import { IEntitySchema } from '../../../schema'
import { Chaining, Filter, Paginate, WithAttributes } from '../../common'
import { BatchWriteChainingKind } from './'
import { BatchWrite } from './batch-write'

function extractFromStack<Table>(stack: Array<Chaining<BatchWriteChainingKind>>): {
    batchWriteMetadata: BatchWrite<Table>,
} {
    const batchWriteMetadata = (stack[0] as any)._batchWrite
    return { batchWriteMetadata }
}

export function execute<Entity>(
    stack: Array<Chaining<BatchWriteChainingKind>>,
) {
    const { batchWriteMetadata } = extractFromStack<Entity>(stack)
    const batchWriteInput = buildBatchWriteInput(batchWriteMetadata)
    return batchWrite<Entity>(batchWriteMetadata.items, batchWriteInput, batchWriteMetadata.schema.dynamoClient)
}
