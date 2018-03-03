import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../../'
import { scan as Scan, ScanResult } from '../../../databaseOperations/scan'
import Expression from '../filter/Expression'
import { resolveExpression } from '../filter/resolveExpression'
import { projectionExpression } from '../projectionExpression'

function buildScanInput<KeySchema>(
    entitySchema: EntitySchema,
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
    }
    if (entitySchema.indexSchema) {
        input.IndexName = entitySchema.indexSchema.indexName
    }
    if (filterExpression) {
        const resolvedExpression = resolveExpression(filterExpression.stack)
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

export function allResults<Entity, KeySchema>(
    entitySchema: EntitySchema,
    expression?: Expression,
    withAttributes?: {
        attributes: string[],
        expressionAttributeNames: { [key: string]: string },
    },
) {
    const scanInput = buildScanInput(entitySchema, expression, withAttributes)
    return Scan<Entity, KeySchema>(scanInput)
}
