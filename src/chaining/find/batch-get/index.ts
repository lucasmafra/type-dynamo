import { WithAttributesType } from '../../common'
import { BatchGetType } from './batch-get'

export type BatchGetChainingKind = BatchGetType | WithAttributesType

export { DynamoBatchGet } from './batch-get'
