import { AllResultsType, FilterType, PaginateType, WithAttributesType } from '../../common'
import { QueryType } from './query'
import { WithOptionsType } from './with-options'
import { WithSortKeyConditionType } from './with-sort-key-condition'

export type QueryChainingKind = QueryType | AllResultsType | WithAttributesType |
 PaginateType | FilterType | WithSortKeyConditionType | WithOptionsType

export { DynamoQuery } from './query'
