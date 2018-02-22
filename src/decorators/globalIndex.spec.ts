import { expect } from 'chai'
import { hiddenProperty } from './constants'
import globalIndex from './globalIndex'

describe('Global index decorator', () => {

    it(`should receive a target and push into the prototype a object inside $ globalIndexes array`,
    () => {

        const decorator = globalIndex(
            'someIndex', 'partitionKey', 'INCLUDE', { readCapacityUnits: 1, writeCapacityUnits: 1}, 'sortKey',
            ['id', 'name', 'email'],
        ) // pass parameters to build decorator function

        const target = {}

        const expected = {
            prototype: {
                [hiddenProperty]: {
                    globalIndexes: [{
                        indexName: 'someIndex',
                        partitionKey: 'partitionKey',
                        projectionType: 'INCLUDE',
                        provisionedThroughput: { readCapacityUnits: 1, writeCapacityUnits: 1 },
                        sortKey: 'sortKey',
                        attributesName: ['id', 'name', 'email'],
                    }],
                },
            },
        }

        decorator(target) // calls the decorator passing the target object

        expect(target).to.deep.equal(expected)

    })

    it(`should push more than 1 object inside globalIndexes array when called more than one time`,
    () => {

      const decorator1 = globalIndex(
          'someIndex', 'partitionKey', 'INCLUDE', { readCapacityUnits: 1, writeCapacityUnits: 1}, 'sortKey',
          ['id', 'name', 'email'],
      )

      const decorator2 = globalIndex(
          'anotherIndex', 'anotherPartitionKey', 'INCLUDE', { readCapacityUnits: 3, writeCapacityUnits: 2},
          'anotherSortKey', ['id', 'name', 'age'],
      )

      const target = {}

      const expected = {
        prototype: {
            [hiddenProperty]: {
                globalIndexes: [{
                    indexName: 'someIndex',
                    partitionKey: 'partitionKey',
                    projectionType: 'INCLUDE',
                    provisionedThroughput: { readCapacityUnits: 1, writeCapacityUnits: 1 },
                    sortKey:  'sortKey',
                    attributesName: ['id', 'name', 'email'],
                }, {
                    indexName: 'anotherIndex',
                    partitionKey: 'anotherPartitionKey',
                    projectionType: 'INCLUDE',
                    provisionedThroughput: { readCapacityUnits: 3, writeCapacityUnits: 2 },
                    sortKey: 'anotherSortKey',
                    attributesName: ['id', 'name', 'age'],
                }],
            },
        },
      }

      decorator1(target) // calls the first decorator passing the target object
      decorator2(target) // calls the second decorator passing the sames target object

      expect(target).to.deep.equal(expected)

    })

})
