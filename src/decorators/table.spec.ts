import { expect } from 'chai'
import { hiddenProperty } from './constants'
import table from './table'

describe('Table decorator', () => {

  it(`should receive a target and push a object inside ${hiddenProperty} property`,
  () => {

    const decorator = table(
        'myTable', { readCapacityUnits: 3, writeCapacityUnits: 2 }, 'expiresAt',
    ) // pass parameters to build decorator function

    const target = {}

    const expected = {
        prototype: {
            [hiddenProperty]: {
                tableName: 'myTable',
                provisionedThroughput: {
                    readCapacityUnits: 3,
                    writeCapacityUnits: 2,
                },
                timeToLive: 'expiresAt',
            },
        },
    }

    decorator(target) // calls the decorator passing the target object

    expect(target).to.deep.equal(expected)

  })

})
