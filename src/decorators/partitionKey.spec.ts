import { expect } from 'chai'
import { hiddenProperty } from './constants'
import partitionKey from './partitionKey'

describe('Partition Key decorator', () => {

    it(`should receive a target and the property name and push this name into ${hiddenProperty}
        partitionKey property`, () => {

        const decorator = partitionKey() // build the decorator

        const target = {}

        decorator(target, 'id') // calls the decorator function passing the target object and the id property

        const expected = {
            [hiddenProperty]: {
                partitionKey: 'id',
            },
        }

        expect(target).to.deep.equal(expected)
    })

})
