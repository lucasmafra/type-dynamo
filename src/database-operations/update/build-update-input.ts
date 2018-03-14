import { DynamoDB } from 'aws-sdk'
const marshalItem = require('dynamodb-marshaler').marshalItem
import { WithCondition } from '../../chaining/common/with-condition'
import { Update } from '../../chaining/update'
import Expression from '../../expressions/expression'
import { resolveExpression } from '../../expressions/resolve-expression'
import { EntitySchema } from '../../schema'
import { mergeExpressionAttributeNames, mergeExpressionAttributeValues } from '../helpers'

export function buildUpdateInput<Table, KeySchema>(
    update: Update<KeySchema>,
    conditionalExpression?: WithCondition,
): DynamoDB.UpdateItemInput {
    const input: DynamoDB.UpdateItemInput = {
        TableName: update.schema.tableName,
        Key: marshalItem(update.key),
        ReturnValues: 'ALL_NEW',
        UpdateExpression: update.updateExpression.resolvedExpression,
    }
    if (conditionalExpression) {
        const expression = resolveExpression((conditionalExpression.expression as any).stack)
        input.ConditionExpression = expression.resolvedExpression
        input.ExpressionAttributeNames = mergeExpressionAttributeNames(
            expression.expressionAttributeNames, update.updateExpression.expressionAttributeNames,
        )
        input.ExpressionAttributeValues = mergeExpressionAttributeValues(
            expression.expressionAttributeValues,
            update.updateExpression.expressionAttributeValues,
        )
    } else {
        input.ExpressionAttributeNames = mergeExpressionAttributeNames(update.updateExpression.expressionAttributeNames)
        input.ExpressionAttributeValues = mergeExpressionAttributeValues(
            update.updateExpression.expressionAttributeValues,
        )
    }
    return input
}
