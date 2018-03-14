import { WithConditionType } from '../common'
import { UpdateType } from './update'

export type UpdateChainingKind = UpdateType | WithConditionType

export { DynamoUpdate, Update, ExplicitKeyItemType, ImplicityKeyItemType } from './update'
