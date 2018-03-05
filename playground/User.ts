import { defineTable, globalIndex, withGlobalIndexes } from '../src/schema'

class User {
    public id: string
    public email: string
    public name: string
    public companyName: string
    public age: number
}

export default defineTable(User, {
    tableName: 'User',
    partitionKey: 'id',
    globalIndexes: withGlobalIndexes(
        globalIndex(User, {
            indexName: 'emailIndex',
            projectionType: 'KEYS_ONLY',
            partitionKey: 'email',
        }),
    ),
})
