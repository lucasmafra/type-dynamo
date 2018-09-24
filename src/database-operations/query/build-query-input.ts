import { DynamoDB } from 'aws-sdk'
import { Filter, Paginate, WithAttributes } from '../../chaining/common'
import { WithOptions } from '../../chaining/find/query/with-options'
import { WithSortKeyCondition  } from '../../chaining/find/query/with-sort-key-condition'
import Expression from '../../expressions/expression'
import { randomGenerator } from '../../helpers/random-generator'
import { ResolvedExpression, resolveExpression } from '../../expressions/resolve-expression'
import { EntitySchema } from '../../schema'
import {
    buildExclusiveStartKey, buildKeyConditionExpression, mergeExpressionAttributeNames,
    mergeExpressionAttributeValues, projectionExpression,
} from '../helpers'
import { DEFAULT_QUERY_LIMIT } from './constants'

export function buildQueryInput<KeySchema>(
    query: {
        schema: EntitySchema,
        partitionKey: string,
    },
    withSortKeyCondition?: WithSortKeyCondition,
    filter?: Filter,
    withAttributes?: WithAttributes,
    withOptions?: WithOptions,
    paginate?: Paginate<KeySchema>,
): DynamoDB.QueryInput {
    const input: DynamoDB.QueryInput = {
        TableName: query.schema.tableName,
    }
    const keyConditionExpression = buildKeyConditionExpression(query.partitionKey, withSortKeyCondition)
    input.KeyConditionExpression = keyConditionExpression.keyConditionExpression
    let resolvedFilterExpression: ResolvedExpression | undefined
    if (query.schema.indexSchema) {
        input.IndexName = query.schema.indexSchema.indexName
    }
    if (filter) {
        resolvedFilterExpression = resolveExpression((filter.filterExpression as any).stack)
        input.FilterExpression = resolvedFilterExpression.resolvedExpression
    }
    if (withAttributes) {
        input.ProjectionExpression = projectionExpression(withAttributes.attributes)
    }
    if (withOptions) {
        input.ScanIndexForward = withOptions.order === 'descending' ?  false : true
    }
    if (paginate) {
        input.Limit = paginate.limit || DEFAULT_QUERY_LIMIT
        if (paginate.lastKey) {
            input.ExclusiveStartKey = buildExclusiveStartKey(paginate.lastKey)
        }
    }
    input.ExpressionAttributeNames = mergeExpressionAttributeNames(
        keyConditionExpression.expressionAttributeNames,
        withSortKeyCondition && withSortKeyCondition.expressionAttributeNames,
        resolvedFilterExpression && resolvedFilterExpression.expressionAttributeNames,
        withAttributes && withAttributes.expressionAttributeNames,
    )
    input.ExpressionAttributeValues = mergeExpressionAttributeValues(
        keyConditionExpression.expressionAttributeValues,
        withSortKeyCondition && withSortKeyCondition.expressionAttributeValues,
        resolvedFilterExpression && resolvedFilterExpression.expressionAttributeValues,
    )
    return input
}
