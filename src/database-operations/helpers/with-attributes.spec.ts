import { WithAttributes } from './with-attributes'
import anything = jasmine.anything

describe('WithAttributes', () => {
  it('generates expression attribute names from attributes', () => {
    const withAttributes = new WithAttributes()
    const attributes = ['id', 'email', 'name']
    expect(withAttributes.build(attributes))
      .toEqual({
        ProjectionExpression: anything(),
        ExpressionAttributeNames: anything(),
      })
  })
})
