import { DynamoDB } from 'aws-sdk'
import { WithCondition } from '../../chaining/common'
import { Delete } from '../../chaining/delete/'
import { resolveExpression } from '../../expressions/resolve-expression'
import { IEntitySchema } from '../../schema'
import {
    buildKey, mergeExpressionAttributeNames, mergeExpressionAttributeValues, projectionExpression,
} from '../helpers'

export function buildDeleteInput<Entity, KeySchema>(
    deleteMetadata: Delete<Entity, KeySchema>,
    withCondition?: WithCondition,
): DynamoDB.DeleteItemInput {
    const input: DynamoDB.DeleteItemInput = {
        TableName: deleteMetadata.schema.tableName,
        Key: buildKey(deleteMetadata.key),
        ReturnValues: 'ALL_OLD',
    }
    if (withCondition) {
        const expression = resolveExpression((withCondition.expression as any).stack)
        input.ConditionExpression = expression.resolvedExpression
        input.ExpressionAttributeNames = mergeExpressionAttributeNames(expression.expressionAttributeNames)
        input.ExpressionAttributeValues = mergeExpressionAttributeValues(expression.expressionAttributeValues)
    }
    return input
}
