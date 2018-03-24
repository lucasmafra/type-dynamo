import { DynamoIndexWithCompositeKey } from '../src/schema/dynamo-index'
import { DynamoORMWithCompositeKey } from '../src/schema/dynamo-orm'
import { typeDynamo } from './database.config'

export class User {
    public email: string
    public name: string
    public companyName: string
    public hiringDate: number // timestamp in ms
    public age: number
}

export const UserRepo = typeDynamo
    .defineTable(User, {
        tableName: 'User',
        partitionKey: 'companyName',
        sortKey: 'hiringDate',
    })
    .withGlobalIndex({
        indexName: 'testIndex',
        projectionType: 'ALL',
        partitionKey: 'companyName',
        sortKey: 'age',
    })
    .getInstance()
