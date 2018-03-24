import { DynamoDB } from 'aws-sdk'
import { buildQueryInput, queryAllResults, queryPaginate, QueryResult} from '../../../database-operations/query'
import { EntitySchema } from '../../../schema'
import { Chaining, Filter, Paginate, WithAttributes } from '../../common'
import { QueryChainingKind } from './'
import { Query } from './query'
import { WithOptions } from './with-options'
import { WithSortKeyCondition } from './with-sort-key-condition'

function extractFromStack<KeySchema>(stack: Array<Chaining<QueryChainingKind>>): {
    query: {
        schema: EntitySchema,
        partitionKey: string,
    },
    withSortKeyCondition?: WithSortKeyCondition,
    filter?: Filter,
    withAttributes?: WithAttributes,
    withOptions?: WithOptions,
    paginate?: Paginate<KeySchema>,
} {
    const query = ((stack[0] as any)._query)
    let withSortKeyCondition: WithSortKeyCondition | undefined
    let filter: Filter | undefined
    let withAttributes: WithAttributes | undefined
    let withOptions: WithOptions | undefined
    let paginate: Paginate<KeySchema> | undefined
    for (const current of stack) {
        switch ((current as any)._kind) {
            case 'withSortKeyCondition': withSortKeyCondition = (current as any)._withSortKeyCondition
            case 'filter': filter = (current as any)._filter
            case 'withAttributes': withAttributes = (current as any)._withAttributes
            case 'withOptions': withOptions = (current as any)._withOptions
            case 'paginate': paginate = (current as any)._paginate
        }
    }
    return { query, filter, withAttributes, paginate, withSortKeyCondition, withOptions }
}

export function executeAllResults<Entity, KeySchema>(
    stack: Array<Chaining<QueryChainingKind>>,
) {
    const { query, filter, withSortKeyCondition, withAttributes, withOptions } = extractFromStack<KeySchema>(stack)
    const queryInput = buildQueryInput(query, withSortKeyCondition, filter, withAttributes, withOptions)
    return queryAllResults<Entity, KeySchema>(queryInput, query.schema.dynamoPromise)
}

export function executePaginate<Entity, KeySchema>(
    stack: Array<Chaining<QueryChainingKind>> ,
) {
    const { query, filter, withSortKeyCondition, withAttributes, withOptions, paginate } = extractFromStack(stack)
    const queryInput = buildQueryInput(query, withSortKeyCondition, filter, withAttributes, withOptions, paginate)
    return queryPaginate<Entity, KeySchema>(queryInput, query.schema.dynamoPromise)
}
