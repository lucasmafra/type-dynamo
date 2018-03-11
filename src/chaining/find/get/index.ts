import { WithAttributesType } from '../../common'
import { GetType } from './get'

export type GetChainingKind = GetType | WithAttributesType

export { DynamoGet } from './get'
