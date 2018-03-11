import { DynamoDB } from 'aws-sdk'
import { WithAttributes } from '../../chaining/common'
import { BatchGet } from '../../chaining/find/batch-get/batch-get'
import { projectionExpression } from '../../chaining/projectionExpression'
import { buildKey } from '../helpers'

export function buildBatchGetInput<KeySchema>(
    batchGet: BatchGet<KeySchema>,
    withAttributes?: WithAttributes,
): DynamoDB.BatchGetItemInput {
    const input: DynamoDB.BatchGetItemInput = {
        RequestItems: {
            [batchGet.schema.tableName]: {
                Keys: batchGet.keys.map((key) => buildKey(key)),
            },
        },
    }
    if (withAttributes) {
        input.RequestItems[batchGet.schema.tableName]
            .ProjectionExpression = projectionExpression(withAttributes.attributes)
        input.RequestItems[batchGet.schema.tableName]
            .ExpressionAttributeNames = withAttributes.expressionAttributeNames
    }
    return input
}
