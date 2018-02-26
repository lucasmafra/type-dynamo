export function keySchema<
    ClassType, PartitionKey extends keyof ClassType, SortKey extends keyof ClassType
    >(
    Class: {new(): ClassType }, schema: {
        partitionKey: PartitionKey, sortKey: SortKey,
    },
): PartitionKey | SortKey

export function keySchema<
    ClassType, PartitionKey extends keyof ClassType
    >(
        Class: {new(): ClassType }, schema: {
            partitionKey: PartitionKey,
        },
): PartitionKey

export function keySchema(constructor: any, schema: any) {
    return schema
}
