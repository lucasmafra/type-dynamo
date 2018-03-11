import { DynamoDB } from 'aws-sdk'
import { Filter, Paginate, WithAttributes } from '../../chaining/common'
import Expression from '../../expressions/expression'
import { ResolvedExpression, resolveExpression } from '../../expressions/resolve-expression'
import { EntitySchema } from '../../schema'
import { buildExclusiveStartKey, mergeExpressionAttributeNames,
    mergeExpressionAttributeValues, projectionExpression } from '../helpers'
import { DEFAULT_SCAN_LIMIT } from './constants'

export function buildScanInput<KeySchema>(
    entitySchema: EntitySchema,
    filter?: Filter,
    withAttributes?: WithAttributes,
    paginate?: Paginate<KeySchema>,
): DynamoDB.ScanInput {
    const input: DynamoDB.ScanInput = {
        TableName: entitySchema.tableName,
    }
    let resolvedFilterExpression: ResolvedExpression | undefined
    if (entitySchema.indexSchema) {
        input.IndexName = entitySchema.indexSchema.indexName
    }
    if (filter) {
        resolvedFilterExpression = resolveExpression((filter.filterExpression as any).stack)
        input.FilterExpression = resolvedFilterExpression.resolvedExpression
    }
    if (withAttributes) {
        input.ProjectionExpression = projectionExpression(withAttributes.attributes)
    }
    if (paginate) {
        input.Limit = paginate.limit || DEFAULT_SCAN_LIMIT
        if (paginate.lastKey) {
            input.ExclusiveStartKey = buildExclusiveStartKey(paginate.lastKey)
        }
    }
    if (filter || withAttributes) {
        input.ExpressionAttributeNames = mergeExpressionAttributeNames(
            resolvedFilterExpression && resolvedFilterExpression.expressionAttributeNames,
            withAttributes && withAttributes.expressionAttributeNames,
        )
        input.ExpressionAttributeValues = mergeExpressionAttributeValues(
            resolvedFilterExpression && resolvedFilterExpression.expressionAttributeValues,
        )
    }
    return input
}
