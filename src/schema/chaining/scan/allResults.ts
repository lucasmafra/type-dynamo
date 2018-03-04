import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../../'
import { scan as Scan, ScanResult } from '../../../databaseOperations/scan'
import Expression from '../expressions/Expression'
import { resolveExpression } from '../expressions/resolveExpression'
import { projectionExpression } from '../projectionExpression'

type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

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

export function allResults<Entity, KeySchema>(
    entitySchema: EntitySchema,
    expression?: Expression,
    withAttributes?: {
        attributes: string[],
        expressionAttributeNames: { [key: string]: string },
    },
): Promise<Omit<ScanResult<Entity, KeySchema>, 'lastKey'>> {
    const scanInput = buildScanInput(entitySchema, expression, withAttributes)
    return Scan<Entity, KeySchema>(scanInput)
}
