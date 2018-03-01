import { DynamoDB } from 'aws-sdk'
import { EntitySchema } from '../../'
import { scan as Scan, ScanResult } from '../../../databaseOperations/scan'
import { projectionExpression } from '../helpers/projectionExpression'

function buildScanInput<KeySchema>(
    entitySchema: EntitySchema,
    limit: number,
    lastKey?: KeySchema,
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
    if (withAttributes) {
        input.ProjectionExpression = projectionExpression(withAttributes)
    }
    return input
}

export function paginate<Entity, KeySchema>(
    entitySchema: EntitySchema,
    limit: number = 100,
    lastKey?: KeySchema,
    withAttributes?: string[],
) {
    const scanInput = buildScanInput(entitySchema, limit, lastKey, withAttributes)
    return Scan<Entity, KeySchema>(scanInput)
}
