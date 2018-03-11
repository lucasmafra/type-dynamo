import { DynamoDB } from 'aws-sdk'
import { buildQueryInput, queryAllResults, queryPaginate} from '../../../database-operations/query'
import { EntitySchema } from '../../../schema'
import { Chaining, Filter, Paginate, WithAttributes } from '../../common'
import { QueryChainingKind } from './'
import { Query } from './query'
import { WithSortKeyCondition } from './with-sort-key-condition'

function extractFromStack<KeySchema>(stack: Array<Chaining<QueryChainingKind>>): {
    query: {
        schema: EntitySchema,
        partitionKey: string,
    },
    withSortKeyCondition?: WithSortKeyCondition,
    filter?: Filter,
    withAttributes?: WithAttributes,
    paginate?: Paginate<KeySchema>,
} {
    const query = ((stack[0] as any)._query)
    let withSortKeyCondition: WithSortKeyCondition | undefined
    let filter: Filter | undefined
    let withAttributes: WithAttributes | undefined
    let paginate: Paginate<KeySchema> | undefined
    for (const current of stack) {
        switch ((current as any)._kind) {
            case 'withSortKeyCondition': withSortKeyCondition = (current as any)._withSortKeyCondition
            case 'filter': filter = (current as any)._filter
            case 'withAttributes': withAttributes = (current as any)._withAttributes
            case 'paginate': paginate = (current as any)._paginate
        }
    }
    return { query, filter, withAttributes, paginate }
}

export function executeAllResults<Entity, KeySchema>(
    stack: Array<Chaining<QueryChainingKind>>,
) {
    const { query, filter, withSortKeyCondition, withAttributes } = extractFromStack<KeySchema>(stack)
    const queryInput = buildQueryInput(query, withSortKeyCondition, filter, withAttributes)
    return queryAllResults<Entity, KeySchema>(queryInput)
}

export function executePaginate<Entity, KeySchema>(
    stack: Array<Chaining<QueryChainingKind>> ,
) {
    const { query, filter, withSortKeyCondition, withAttributes, paginate } = extractFromStack(stack)
    const queryInput = buildQueryInput(query, withSortKeyCondition, filter, withAttributes, paginate)
    return queryPaginate<Entity, KeySchema>(queryInput)
}
