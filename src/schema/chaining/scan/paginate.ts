import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../../'
import { scan as Scan, ScanResult } from '../../../databaseOperations/scan'
import Expression from '../filter/Expression'
import { resolveExpression } from '../filter/resolveExpression'
import { projectionExpression } from '../projectionExpression'

function buildScanInput<KeySchema>(
    entitySchema: EntitySchema,
    limit: number,
    lastKey?: KeySchema,
    filterExpression?: Expression,
    withAttributes?: string[],
): DynamoDB.ScanInput {
    const input: DynamoDB.ScanInput = {
        TableName: entitySchema.tableName,
        Limit: limit,
    }
    if (entitySchema.indexSchema) {
        input.IndexName = entitySchema.indexSchema.indexName
    }
    if (lastKey) {
        input.ExclusiveStartKey = lastKey as any
    }
    if (filterExpression) {
        const resolvedExpression = resolveExpression(filterExpression.stack)
        input.FilterExpression = resolvedExpression.resolvedExpression
        input.ExpressionAttributeValues = resolvedExpression.expressionAttributeValues as any
    }
    if (withAttributes) {
        input.ProjectionExpression = projectionExpression(withAttributes)
    }
    return input
}

export function paginate<Entity, KeySchema>(
    entitySchema: EntitySchema,
    limit: number = 100,
    lastKey?: KeySchema,
    expression?: Expression,
    withAttributes?: string[],
) {
    const scanInput = buildScanInput(entitySchema, limit, lastKey, expression, withAttributes)
    return Scan<Entity, KeySchema>(scanInput)
}
