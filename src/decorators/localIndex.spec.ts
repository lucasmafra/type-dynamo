import { expect } from 'chai'
import { hiddenProperty } from './constants'
import localIndex from './localIndex'

describe('Local index decorator', () => {

    it(`should receive a target and push an object inside ${hiddenProperty} localIndexes array`,
    () => {

        const decorator = localIndex(
            'myIndex', 'myPartitionKey', 'ALL', { readCapacityUnits: 1, writeCapacityUnits: 1 },
            'mySortKey', ['id', 'email'],
        ) // pass parameters to build decorator function

        const target = {}

        const expected = {
            prototype: {
                [hiddenProperty]: {
                    localIndexes: [{
                        indexName: 'myIndex',
                        partitionKey: 'myPartitionKey',
                        projectionType: 'ALL',
                        provisionedThroughput: { readCapacityUnits: 1, writeCapacityUnits: 1 },
                        sortKey: 'mySortKey',
                        attributesName: ['id', 'email'],
                    }],
                },
            },
        }

        decorator(target) // calls the decorator passing the target object

        expect(target).to.deep.equal(expected)

    })

    it(`should push more than 1 object inside localIndexes array when called more than one time`,
    () => {

        const decorator1 = localIndex(
            'myIndex', 'myPartitionKey', 'ALL', { readCapacityUnits: 1, writeCapacityUnits: 1 },
            'mySortKey', ['id', 'email'],
        )

        const decorator2 = localIndex(
            'anotherIndex', 'anotherPartitionKey', 'ALL', { readCapacityUnits: 2, writeCapacityUnits: 3 },
            'anotherSortKey', ['id', 'mobileNumber'],
        )

        const target = {}

        const expected = {
            prototype: {
                [hiddenProperty]: {
                    localIndexes: [{
                        indexName: 'myIndex',
                        partitionKey: 'myPartitionKey',
                        projectionType: 'ALL',
                        provisionedThroughput: { readCapacityUnits: 1, writeCapacityUnits: 1 },
                        sortKey: 'mySortKey',
                        attributesName: ['id', 'email'],
                    }, {
                        indexName: 'anotherIndex',
                        partitionKey: 'anotherPartitionKey',
                        projectionType: 'ALL',
                        provisionedThroughput: { readCapacityUnits: 2, writeCapacityUnits: 3 },
                        sortKey: 'anotherSortKey',
                        attributesName: ['id', 'mobileNumber'],
                    }],
                },
            },
        }

        decorator1(target) // calls the first decorator passing the target object
        decorator2(target) // calls the second decorator passing the sames target object

        expect(target).to.deep.equal(expected)

    })

})
