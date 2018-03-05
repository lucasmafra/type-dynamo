import { defineTable, globalIndex, withGlobalIndexes } from '../src/schema'

class User {
    public email: string
    public name: string
    public companyName: string
    public hiringDate: number // timestamp in ms
    public age: number
}

export default defineTable(User, {
    tableName: 'User',
    partitionKey: 'companyName',
    sortKey: 'hiringDate',
    globalIndexes: withGlobalIndexes(
        globalIndex(User, {
            indexName: 'emailIndex',
            projectionType: 'KEYS_ONLY',
            partitionKey: 'email',
        }),
    ),
})
