import { DynamoDB } from 'aws-sdk'
import { WithAttributes } from '../../chaining/common'
import { BatchWrite } from '../../chaining/save/batch-write/batch-write'
import { EntitySchema } from '../../schema'
import { buildKey, projectionExpression } from '../helpers'
const marshalItem = require('dynamodb-marshaler').marshalItem

export function buildBatchWriteInput<Table>(
    batchWrite: BatchWrite<Table>,
): DynamoDB.BatchWriteItemInput {
    const input: DynamoDB.BatchWriteItemInput = {
        RequestItems: {
            [batchWrite.schema.tableName]: [
                ...batchWrite.items.map( (item) => ({ PutRequest: { Item: marshalItem(item) } })),
            ],
        },
    }
    return input
}
