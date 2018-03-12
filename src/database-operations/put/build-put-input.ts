import { DynamoDB } from 'aws-sdk'
const marshalItem = require('dynamodb-marshaler').marshalItem
import { WithCondition } from '../../chaining/common/with-condition'
import { Put } from '../../chaining/save/put/put'
import Expression from '../../expressions/expression'
import { resolveExpression } from '../../expressions/resolve-expression'
import { EntitySchema } from '../../schema'
export function buildPutInput<Table>(
    put: Put<Table>,
    conditionalExpression?: WithCondition,
): DynamoDB.PutItemInput {
    const input: DynamoDB.PutItemInput = {
        TableName: put.schema.tableName,
        Item: marshalItem(put.item),
    }
    if (conditionalExpression) {
        const expression = resolveExpression((conditionalExpression.expression as any).stack)
        input.ConditionExpression = expression.resolvedExpression
        input.ExpressionAttributeNames = expression.expressionAttributeNames
        input.ExpressionAttributeValues = expression.expressionAttributeValues
    }
    return input
}
