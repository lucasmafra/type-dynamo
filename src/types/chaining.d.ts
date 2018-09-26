export type BatchGetChaining = 'batchGet' | 'withAttributes'

export type GetChaining = 'get' | 'withAttributes'

export type QueryChaining = 'query' | 'allResults' | 'withAttributes' |
  'paginate'| 'filter' | 'withSortKeyCondition' | 'withOptions'

export type ScanChaining = 'scan' | 'allResults' | 'withAttributes' |
  'paginate' | 'filter'
