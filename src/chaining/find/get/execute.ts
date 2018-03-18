import { DynamoDB } from 'aws-sdk'
import { buildGetInput, get, GetResult} from '../../../database-operations/get'
import { EntitySchema } from '../../../schema'
import { Chaining, Filter, Paginate, WithAttributes } from '../../common'
import { GetChainingKind } from './'
import { Get } from './get'

function extractFromStack<KeySchema>(stack: Array<Chaining<GetChainingKind>>): {
    getMetadata: Get<KeySchema>,
    withAttributes?: WithAttributes,
} {
    const getMetadata = (stack[0] as any)._get
    let withAttributes: WithAttributes | undefined
    for (const current of stack) {
        switch ((current as any)._kind) {
            case 'withAttributes': withAttributes = (current as any)._withAttributes
        }
    }
    return { getMetadata, withAttributes }
}

export function execute<Entity, KeySchema>(
    stack: Array<Chaining<GetChainingKind>>,
) {
    const { getMetadata, withAttributes } = extractFromStack<KeySchema>(stack)
    const getInput = buildGetInput(getMetadata, withAttributes)
    return get<Entity, KeySchema>(getInput, getMetadata.schema.dynamoPromise)
}
