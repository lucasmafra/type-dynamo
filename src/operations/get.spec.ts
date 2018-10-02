import { DynamoDB } from 'aws-sdk'
import { IGetInput } from '../types'
import { Get } from './get'

let get: Get

const dynamoClient = {
  getItem: jest.fn(() => ({
    promise: async () => ({ Item: {id: {S: '1'}, name: {S: 'John Doe'}} }),
  })),
}

const helpers = {
  withAttributesGenerator: {generateExpression: jest.fn()},
}

let input: IGetInput<any>

describe('Get', () => {
  beforeEach(() => {
    input = {
      tableName: 'DummyTable',
      key: {id: '1'},
    }
    get = new Get(dynamoClient as any, helpers as any)
    dynamoClient.getItem.mockClear()
  })

  it('calls dynamoClient correctly', async () => {
    const dynamoInput: DynamoDB.GetItemInput = {
      TableName: 'DummyTable', Key: {id: {S: '1'}},
    }
    await get.execute(input)
    expect(dynamoClient.getItem).toHaveBeenCalledWith(dynamoInput)
  })
  
  it('returns item in correct format', async () => {
    expect(await get.execute(input)).toEqual({
      data: { id: '1', name: 'John Doe' },
    })
  })
  // @ts-ignore
  context('when withAttributes option is present', () => {
    const withAttributes = ['id', 'email']

    beforeEach(() => {
      input.withAttributes = withAttributes
      helpers.withAttributesGenerator.generateExpression
        .mockImplementationOnce(() => ({
          expressionAttributeNames: {
            '#id': 'id', '#email': 'email',
          },
          projectionExpression: '#id, #email',
        }))
    })

    it('calls dynamoClient with projection expression', async () => {
      await get.execute(input)
      expect(dynamoClient.getItem.mock.calls[0][0]).toMatchObject({
        ProjectionExpression: '#id, #email',
        ExpressionAttributeNames: {
          '#id': 'id', '#email': 'email',
        },
      })
    })
  })

  // @ts-ignore
  context('when dynamoClient returns no item', () => {
    beforeEach(() => {
      dynamoClient.getItem.mockImplementationOnce(
        () => ({
          promise: async () => ({ Item: undefined }),
        }),
      )
    })

    it('throws ItemNotFound error', async () => {
      expect(get.execute(input))
        .rejects.toThrow('ItemNotFound')
    })
  })
})
