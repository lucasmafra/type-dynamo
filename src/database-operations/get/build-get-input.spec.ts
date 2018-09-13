import { buildGetInput } from './build-get-input'

describe('buildGetInput', () => {
  const schema = { schema: { tableName: 'DummyTable' }, key: { id: '1' } }

  it('builds get input from schema', () => {
    expect(buildGetInput(schema as any)).toEqual({
      TableName: 'DummyTable',
      Key: {
        id: {
          S: '1',
        },
      },
    })
  })

  // @ts-ignore
  context('when withAttributes option is present', () => {
    const withAttributes = {
      attributes: ['#id', '#name', '#email'],
      expressionAttributeNames: {
        '#id': 'id', '#name': 'name', '#email': 'email',
      },
    }

    it('builds projection expression', () => {
      expect(buildGetInput(schema as any, withAttributes)).toMatchObject({
        ProjectionExpression: '#id,#name,#email',
        ExpressionAttributeNames: {
          '#id': 'id', '#name': 'name', '#email': 'email',
        },
      })
    })
  })
})
