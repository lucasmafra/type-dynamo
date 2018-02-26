import DynamoIndex from './DynamoIndex'

export function withLocalIndexes<
    LocalIndex1
>(
    localIndex1: LocalIndex1,
): LocalIndex1

export function withLocalIndexes<
    LocalIndex1,
    LocalIndex2
>(
    localIndex1: LocalIndex1,
    localIndex2: LocalIndex2,
): LocalIndex1 & LocalIndex2

export function withLocalIndexes<
    LocalIndex1,
    LocalIndex2,
    LocalIndex3
    >(
    localIndex1: LocalIndex1,
    localIndex2: LocalIndex2,
    localIndex3: LocalIndex3,
): LocalIndex1 & LocalIndex2 & LocalIndex3

export function withLocalIndexes<
    LocalIndex1,
    LocalIndex2,
    LocalIndex3,
    LocalIndex4
    >(
    localIndex1: LocalIndex1,
    localIndex2: LocalIndex2,
    localIndex3: LocalIndex3,
    localIndex4: LocalIndex4,
    ): LocalIndex1 & LocalIndex2 & LocalIndex3 & LocalIndex4

export function withLocalIndexes<
    LocalIndex1,
    LocalIndex2,
    LocalIndex3,
    LocalIndex4,
    LocalIndex5
    >(
    localIndex1: LocalIndex1,
    localIndex2: LocalIndex2,
    localIndex3: LocalIndex3,
    localIndex4: LocalIndex4,
    localIndex5: LocalIndex5,
    ): LocalIndex1 & LocalIndex2 & LocalIndex3 & LocalIndex4 & LocalIndex5

export function withLocalIndexes(...indexes: any[]) {
    const obj = indexes.reduce((acc, cur, i) => {
        acc[i] = cur;
        return acc;
      }, {})
}
