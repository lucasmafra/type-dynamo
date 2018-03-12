import { DynamoDB } from 'aws-sdk'
import { WithAttributes } from '../../chaining/common'
import { BatchDelete } from '../../chaining/delete/batch-delete'
import { EntitySchema } from '../../schema'
import { buildKey, projectionExpression } from '../helpers'
const marshalItem = require('dynamodb-marshaler').marshalItem

export function buildBatchDeleteInput<Table>(
    batchDelete: BatchDelete<Table>,
): DynamoDB.BatchWriteItemInput {
    const input: DynamoDB.BatchWriteItemInput = {
        RequestItems: {
            [batchDelete.schema.tableName]: [
                ...batchDelete.keys.map( (key) => ({ DeleteRequest: { Key: marshalItem(key) } })),
            ],
        },
    }
    return input
}
