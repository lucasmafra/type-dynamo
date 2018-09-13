import { DynamoDB } from 'aws-sdk'
import { WithAttributes } from '../../chaining/common'
import { Get } from '../../chaining/find/get/get'
import { buildKey, projectionExpression } from '../helpers'

export function buildGetInput<KeySchema>(
    get: Get<KeySchema>,
    withAttributes?: WithAttributes,
): DynamoDB.GetItemInput {
    const input: DynamoDB.GetItemInput = {
        TableName: get.schema.tableName,
        Key: buildKey(get.key),
    }
    if (withAttributes) {
        input.ProjectionExpression = projectionExpression(withAttributes.attributes)
        input.ExpressionAttributeNames = withAttributes.expressionAttributeNames
    }
    return input
}
