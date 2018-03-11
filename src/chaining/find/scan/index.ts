import { AllResultsType, FilterType, PaginateType, WithAttributesType } from '../../common'
import { ScanType } from './scan'

export type ScanChainingKind = ScanType | AllResultsType | WithAttributesType |
 PaginateType | FilterType

export { DynamoScan } from './scan'
