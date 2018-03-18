import { globalIndex, withGlobalIndexes } from '../src'
import { DynamoIndexWithSimpleKey } from '../src/schema/dynamo-index'
import { DynamoORMWithCompositeKey } from '../src/schema/dynamo-orm'
import { typeDynamo } from './database.config'

export class User {
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
