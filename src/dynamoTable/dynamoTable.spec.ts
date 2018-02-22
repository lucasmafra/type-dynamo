import { expect } from 'chai'
import { Attribute, GlobalIndex, LocalIndex, PartitionKey, SortKey, Table } from '../decorators'
import DynamoTable from './dynamoTable'

@Table('Test1Table', { readCapacityUnits: 1, writeCapacityUnits: 1}, 'expiresAt')
@GlobalIndex('firstGlobalIndex', 'id', 'INCLUDE', { readCapacityUnits: 1, writeCapacityUnits: 1 },
'expiresAt', ['email'])
class Test1 extends DynamoTable {

    @Attribute('user_id') @PartitionKey()
    public id: string

    @Attribute('user_name')
    public name: string

    @Attribute()
    public email: number

    @Attribute('expires_at')
    public expiresAt: number
}

describe('DynamoTable', () => {

    it('should build the table schema in the constructor and have a method to return it', () => {
        const test1 = new Test1()
        const expected = {
            partitionKey: 'id',
            attributes: [{
                name: 'id',
                alias: 'user_id',
            }, {
                name: 'name',
                alias: 'user_name',
            }, {
                name: 'email',
                alias: 'email',
            }, {
                name: 'expiresAt',
                alias: 'expires_at',
            }],
            globalIndexes: [{
                indexName: 'firstGlobalIndex',
                partitionKey: 'id',
                projectionType: 'INCLUDE',
                provisionedThroughput: {
                    readCapacityUnits: 1,
                    writeCapacityUnits: 1,
                },
                sortKey: 'expiresAt',
                attributes: [{
                    name: 'id',
                    alias: 'user_id',
                }, {
                    name: 'expiresAt',
                    alias: 'expires_at',
                }, {
                    name: 'email',
                    alias: 'email',
                }],
            }],
            tableName: 'Test1Table',
            timeToLive: 'expiresAt',
            provisionedThroughput: {
                readCapacityUnits: 1,
                writeCapacityUnits: 1,
            },
            localIndexes: [],
        }
        expect(test1.getTableSchema()).to.be.deep.equals(expected)
    })

})
