import { WithConditionType } from '../../common'
import { DeleteType } from './delete'

export type DeleteChainingKind = DeleteType | WithConditionType

export { DynamoDelete, Delete } from './delete'
