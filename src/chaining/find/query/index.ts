import { AllResultsType, FilterType, PaginateType, WithAttributesType } from '../../common'
import { QueryType } from './query'
import { WithSortKeyConditionType } from './with-sort-key-condition'

export type QueryChainingKind = QueryType | AllResultsType | WithAttributesType |
 PaginateType | FilterType | WithSortKeyConditionType

export { DynamoQuery } from './query'
