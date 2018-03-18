import { DynamoDB } from 'aws-sdk'
import { buildScanInput, scanAllResults, scanPaginate, ScanResult} from '../../../database-operations/scan'
import { EntitySchema } from '../../../schema'
import { Chaining, Filter, Paginate, WithAttributes } from '../../common'
import { ScanChainingKind } from './'

function extractFromStack<KeySchema>(stack: Array<Chaining<ScanChainingKind>>): {
    schema: EntitySchema,
    filter?: Filter,
    withAttributes?: WithAttributes,
    paginate?: Paginate<KeySchema>,
} {
    const schema = (stack[0] as any)._schema
    let filter: Filter | undefined
    let withAttributes: WithAttributes | undefined
    let paginate: Paginate<KeySchema> | undefined
    for (const current of stack) {
        switch ((current as any)._kind) {
            case 'filter': filter = (current as any)._filter
            case 'withAttributes': withAttributes = (current as any)._withAttributes
            case 'paginate': paginate = (current as any)._paginate
        }
    }
    return { schema, filter, withAttributes, paginate }
}

export function executeAllResults<Entity, KeySchema>(
    stack: Array<Chaining<ScanChainingKind>>,
) {
    const { schema, filter, withAttributes } = extractFromStack<KeySchema>(stack)
    const scanInput = buildScanInput(schema, filter, withAttributes)
    return scanAllResults<Entity, KeySchema>(scanInput, schema.dynamoPromise)
}

export function executePaginate<Entity, KeySchema>(
    stack: Array<Chaining<ScanChainingKind>>,
) {
    const { schema, filter, withAttributes, paginate } = extractFromStack(stack)
    const scanInput = buildScanInput(schema, filter, withAttributes, paginate)
    return scanPaginate<Entity, KeySchema>(scanInput, schema.dynamoPromise)
}
