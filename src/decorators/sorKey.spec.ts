import { expect } from 'chai'
import { hiddenProperty } from './constants'
import sortKey from './sortKey'

describe('Sort Key decorator', () => {

    it(`should receive a target and the property name and push this name into ${hiddenProperty}
        sortKey property`, () => {

        const decorator = sortKey() // build the decorator

        const target = {}

        decorator(target, 'userId') // calls the decorator function passing the target object and the id property

        const expected = {
            [hiddenProperty]: {
                sortKey: 'userId',
            },
        }

        expect(target).to.deep.equal(expected)
    })

})
