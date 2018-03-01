import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../../'
import { scan as Scan, ScanResult } from '../../../databaseOperations/scan'
import { projectionExpression } from '../helpers/projectionExpression'

function buildScanInput<KeySchema>(
    entitySchema: EntitySchema,
    withAttributes?: string[],
): DynamoDB.ScanInput {
    const input: DynamoDB.ScanInput = {
        TableName: entitySchema.tableName,
    }
    if (entitySchema.indexSchema) {
        input.IndexName = entitySchema.indexSchema.indexName
    }
    if (withAttributes) {
        input.ProjectionExpression = projectionExpression(withAttributes)
    }
    return input
}

export function allResults<Entity, KeySchema>(
    entitySchema: EntitySchema,
    withAttributes?: string[],
) {
    const scanInput = buildScanInput(entitySchema, withAttributes)
    return Scan<Entity, KeySchema>(scanInput)
}
