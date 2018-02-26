import DynamoIndex from './DynamoIndex'

export function localIndex<
    Table,
    IndexName extends string,
    KeySchema extends keyof Table
    >(
        table: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'KEYS_ONLY',
        keySchema: KeySchema,
    },
): { [P in IndexName]: DynamoIndex<Pick<Table, KeySchema>, Pick<Table, KeySchema>> }

export function localIndex<
    Table,
    IndexName extends string,
    KeySchema extends keyof Table
    >(
        Class: {new(): Table }, config: {
        indexName: IndexName,
        projectionType: 'ALL',
        keySchema: KeySchema,
    },
): { [P in IndexName]: DynamoIndex<Table, Pick<Table, KeySchema>> }

export function localIndex<
    Table,
    IndexName extends string,
    KeySchema extends keyof Table,
    ProjectionAttributes extends keyof Table
>(
    Class: {new(): Table }, config: {
    indexName: IndexName,
    projectionType: 'INCLUDE',
    attributes: ProjectionAttributes[]
    keySchema: KeySchema,
},
): { [P in IndexName]: DynamoIndex<
    Pick<Table, KeySchema | ProjectionAttributes>,
    Pick<Table, KeySchema>
> }

export function localIndex(constructor: any, config: any) {
    return { [config.indexName] : new DynamoIndex(config) }
}
