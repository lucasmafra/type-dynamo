import { expect } from 'chai'
import attribute from './attribute'
import { hiddenProperty } from './constants'

describe('Attribute decorator', () => {

    it('should receive a target and a property name and initialize the given property with undefined', () => {
        const decorator = attribute() // build the decorator
        const target = {}
        decorator(target, 'id') // call the decorator
        expect((target as any).id).to.be.equal(undefined)
    })

    it(`should receive a target and a property name and push the property name
    into attributes list inside ${hiddenProperty}`, () => {
        const decorator = attribute()
        const target = {}
        decorator(target, 'id')
        const expected = {
            [hiddenProperty]: {
                attributes: [{
                    name: 'id',
                    alias: 'id',
                }],
            },
            id: undefined,
        }
        expect(target).to.be.deep.equal(expected)
    })

    it(`should accept an alias parameter and save this alias inside attributes list`, () => {
        const decorator = attribute('user_id')
        const target = {}
        decorator(target, 'id')
        const expected = {
            [hiddenProperty]: {
                attributes: [{
                    name: 'id',
                    alias: 'user_id',
                }],
            },
            id: undefined,
        }
        expect(target).to.be.deep.equal(expected)
    })

})
