import { globalIndex, withGlobalIndexes } from '../src/schema'
import { typeDynamo } from './database.config'

class User {
    public email: string
    public name: string
    public companyName: string
    public hiringDate: number // timestamp in ms
    public age: number
}

export default typeDynamo.define(User, {
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
