import { DynamoDB } from 'aws-sdk'
import { batchDelete, BatchDeleteResult, buildBatchDeleteInput} from '../../../operations/batch-delete'
import { EntitySchema } from '../../../schema'
import { Chaining, Filter, Paginate, WithAttributes } from '../../common'
import { BatchDeleteChainingKind } from './'
import { BatchDelete } from './batch-delete'

function extractFromStack<Table>(stack: Array<Chaining<BatchDeleteChainingKind>>): {
    batchDeleteMetadata: BatchDelete<Table>,
} {
    const batchDeleteMetadata = (stack[0] as any)._batchDelete
    return { batchDeleteMetadata }
}

export function execute<Entity>(
    stack: Array<Chaining<BatchDeleteChainingKind>>,
) {
    const { batchDeleteMetadata } = extractFromStack<Entity>(stack)
    const batchDeleteInput = buildBatchDeleteInput(batchDeleteMetadata)
    return batchDelete(batchDeleteInput, batchDeleteMetadata.schema.dynamoClient)
}
