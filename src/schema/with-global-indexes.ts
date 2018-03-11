export function withGlobalIndexes<
    GlobalIndex1
>(
    globalIndex1: GlobalIndex1,
): GlobalIndex1

export function withGlobalIndexes<
    GlobalIndex1,
    GlobalIndex2
>(
    globalIndex1: GlobalIndex1,
    globalIndex2: GlobalIndex2,
): GlobalIndex1 & GlobalIndex2

export function withGlobalIndexes<
    GlobalIndex1,
    GlobalIndex2,
    GlobalIndex3
    >(
    globalIndex1: GlobalIndex1,
    globalIndex2: GlobalIndex2,
    globalIndex3: GlobalIndex3,
): GlobalIndex1 & GlobalIndex2 & GlobalIndex3

export function withGlobalIndexes<
    GlobalIndex1,
    GlobalIndex2,
    GlobalIndex3,
    GlobalIndex4
    >(
    globalIndex1: GlobalIndex1,
    globalIndex2: GlobalIndex2,
    globalIndex3: GlobalIndex3,
    globalIndex4: GlobalIndex4,
    ): GlobalIndex1 & GlobalIndex2 & GlobalIndex3 & GlobalIndex4

export function withGlobalIndexes<
    GlobalIndex1,
    GlobalIndex2,
    GlobalIndex3,
    GlobalIndex4,
    GlobalIndex5
    >(
    globalIndex1: GlobalIndex1,
    globalIndex2: GlobalIndex2,
    globalIndex3: GlobalIndex3,
    globalIndex4: GlobalIndex4,
    globalIndex5: GlobalIndex5,
    ): GlobalIndex1 & GlobalIndex2 & GlobalIndex3 & GlobalIndex4 & GlobalIndex5

export function withGlobalIndexes(...indexes: any[]) {
    return indexes.reduce((acc, cur) => {
        Object.assign(acc, cur)
        return acc
      }, {})
}
