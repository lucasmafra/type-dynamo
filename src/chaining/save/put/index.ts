import { WithConditionType } from '../../common'
import { PutType } from './put'

export type PutChainingKind = PutType | WithConditionType

export { DynamoPut } from './put'
