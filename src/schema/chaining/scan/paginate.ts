import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../../'
import { scan as Scan, ScanResult } from '../../../databaseOperations/scan'
import Expression from '../expressions/Expression'
import { resolveExpression } from '../expressions/resolveExpression'
import { projectionExpression } from '../projectionExpression'

export function buildExclusiveStartKey<KeySchema>(lastKey: KeySchema) {
    let result = {}
    for (const propertyKey in lastKey) {
        if (lastKey.hasOwnProperty(propertyKey)) {
            result = Object.assign({}, result, {
                [propertyKey]: {
                    [typeof lastKey[propertyKey] === 'string' ? 'S' : 'N']: lastKey[propertyKey],
                },
            })
        }
    }
    return result
}

function buildScanInput<KeySchema>(
    entitySchema: EntitySchema,
    limit: number,
    lastKey?: KeySchema,
    filterExpression?: Expression,
    withAttributes?: {
        attributes: string[],
        expressionAttributeNames: {
            [key: string]: string,
        },
    },
): DynamoDB.ScanInput {
    const input: DynamoDB.ScanInput = {
        TableName: entitySchema.tableName,
        Limit: limit,
    }
    if (entitySchema.indexSchema) {
        input.IndexName = entitySchema.indexSchema.indexName
    }
    if (lastKey) {
        input.ExclusiveStartKey = buildExclusiveStartKey(lastKey) as any
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
    return input
}

export function paginate<Entity, KeySchema>(
    entitySchema: EntitySchema,
    limit: number = 100,
    lastKey?: KeySchema,
    expression?: Expression,
    withAttributes?: {
        attributes: string[],
        expressionAttributeNames: {
            [key: string]: string,
        },
    },
) {
    const scanInput = buildScanInput(entitySchema, limit, lastKey, expression, withAttributes)
    return Scan<Entity, KeySchema>(scanInput)
}
