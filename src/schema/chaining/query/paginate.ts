import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../../'
import { query as Query, QueryResult } from '../../../databaseOperations/query'
import Expression from '../expressions/Expression'
import { randomGenerator } from '../expressions/randomGenerator'
import { resolveExpression } from '../expressions/resolveExpression'
import { projectionExpression } from '../projectionExpression'

function buildKeyConditionExpression<PartitionKey>(
    partitionKey: PartitionKey,
    sortKeyConditionExpression?: {
        expression: string
        expressionAttributeNames: {
            [key: string]: string,
        },
        expressionAttributeValues: {
            [key: string]: string,
        },
    },
) {
    let keyConditionExpression: string = ''
    let expressionAttributeNames = {}
    let expressionAttributeValues = {}
    for (const partitionKeyName in partitionKey) {
        if (partitionKey.hasOwnProperty(partitionKeyName)) {
            const randomIdName = '#' + randomGenerator()
            const randomIdValue = ':' + randomGenerator()
            keyConditionExpression += `${randomIdName} = ${randomIdValue}`
            expressionAttributeNames[randomIdName] = partitionKeyName
            expressionAttributeValues[randomIdValue] = {
                [typeof partitionKey[partitionKeyName] === 'string' ? 'S' : 'N']: randomIdValue,
            }
        }
    }
    if (sortKeyConditionExpression) {
        keyConditionExpression += ` AND ${sortKeyConditionExpression.expression}`
        expressionAttributeNames = Object.assign(
            {}, expressionAttributeNames, sortKeyConditionExpression.expressionAttributeNames,
        )
        expressionAttributeValues = Object.assign(
            {}, expressionAttributeValues, sortKeyConditionExpression.expressionAttributeValues,
        )
    }
    return {
        keyConditionExpression,
        expressionAttributeNames,
        expressionAttributeValues,
    }
}

function buildQueryInput<PartitionKey, SortKey>(
    entitySchema: EntitySchema,
    partitionKey: PartitionKey,
    limit: number,
    sortKeyConditionExpression?: {
        expression: string,
        expressionAttributeNames: {
            [key: string]: string,
        },
        expressionAttributeValues: {
            [key: string]: string,
        },
    },
    lastKey?: PartitionKey & SortKey,
    filterExpression?: Expression,
    withAttributes?: {
        attributes: string[],
        expressionAttributeNames: {
            [key: string]: string,
        },
    },
): DynamoDB.QueryInput {
    const keyConditionExpression = buildKeyConditionExpression(partitionKey, sortKeyConditionExpression)
    const input: DynamoDB.QueryInput = {
        TableName: entitySchema.tableName,
        Limit: limit,
        KeyConditionExpression: keyConditionExpression.keyConditionExpression,
    }
    if (entitySchema.indexSchema) {
        input.IndexName = entitySchema.indexSchema.indexName
    }
    if (lastKey) {
        input.ExclusiveStartKey = lastKey as any
    }
    if (filterExpression) {
        const resolvedExpression = resolveExpression((filterExpression as any).stack)
        input.FilterExpression = resolvedExpression.resolvedExpression
        input.ExpressionAttributeNames = resolvedExpression.expressionAttributeNames
        input.ExpressionAttributeValues = resolvedExpression.expressionAttributeValues as any
    }
    if (withAttributes) {
        input.ProjectionExpression = projectionExpression(withAttributes.attributes)
        input.ExpressionAttributeNames = Object.assign(
            {},
            input.ExpressionAttributeNames,
            withAttributes.expressionAttributeNames,
        )
    }
    input.ExpressionAttributeNames = Object.assign(
        {},
        input.ExpressionAttributeNames,
        keyConditionExpression.expressionAttributeNames,
    )
    input.ExpressionAttributeValues = Object.assign(
        {},
        input.ExpressionAttributeValues,
        keyConditionExpression.expressionAttributeValues,
    )
    return input
}

export function paginate<Entity, PartitionKey, SortKey>(
    entitySchema: EntitySchema,
    limit: number = 100,
    partitionKey: PartitionKey,
    lastKey?: PartitionKey & SortKey,
    expression?: Expression,
    sortKeyConditionExpression?: {
        expression: string,
        expressionAttributeNames: {
            [key: string]: string,
        },
        expressionAttributeValues: {
            [key: string]: string,
        },
    },
    withAttributes?: {
        attributes: string[],
        expressionAttributeNames: {
            [key: string]: string,
        },
    },
) {
    const queryInput = buildQueryInput(
        entitySchema, partitionKey, limit, sortKeyConditionExpression, lastKey, expression, withAttributes,
    )
    return Query<Entity, PartitionKey & SortKey>(queryInput)
}
