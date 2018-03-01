import { defineTable, globalIndex, keySchema, withGlobalIndexes } from '../src/schema'

class User {
    public id: string
    public email: string
    public name: string
    public age: number
}

export default defineTable(User, {
    tableName: 'User',
    keySchema: keySchema(User, {
        partitionKey: 'id',
    }),
    globalIndexes: withGlobalIndexes(
        globalIndex(User, {
            indexName: 'emailIndex',
            projectionType: 'ALL',
            keySchema: keySchema(User, {
                partitionKey: 'email',
            }),
        }),
        globalIndex(User, {
            indexName: 'otherIndex',
            projectionType: 'KEYS_ONLY',
            keySchema: keySchema(User, {
                partitionKey: 'name',
            }),
        }),
    ),
})
