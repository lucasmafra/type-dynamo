import { AWSError, DynamoDB } from 'aws-sdk'
import { IBatchGetInput } from '../types'
import { BatchGet } from './batch-get'

let batchGet: BatchGet

const dynamoClient = {
  batchGetItem: jest.fn(() => ({
    promise: async () => ({
      Responses: {
        UserTable: [
          { id: { S: '1' }, name: { S: 'John' } },
          { id: { S: '2' }, name: { S: 'Doe' } },
          { id: { S: '3'}, name: { S: 'Ronaldinho' } },
        ],
      },
      UnprocessedKeys: {},
    }),
  })),
}

const helpers = {
  timeout: { wait: jest.fn() },
  withAttributesGenerator: { generateExpression: jest.fn() },
}

let input: IBatchGetInput<any>

describe('BatchGet', () => {
  beforeEach(() => {
    input = {
      tableName: 'UserTable',
      keys: [{ id: '1' }, { id: '2' }, { id: '3' }],
    }
    batchGet = new BatchGet(dynamoClient as any, helpers as any)
    dynamoClient.batchGetItem.mockClear()
  })

  it('calls dynamoClient correctly', async () => {
    const dynamoInput: DynamoDB.BatchGetItemInput = {
      RequestItems: {
       UserTable: {
         Keys: [{ id: { S: '1' } }, { id: { S: '2' }}, { id: { S: '3' }}],
       },
      },
    }
    await batchGet.execute(input)
    expect(dynamoClient.batchGetItem).toHaveBeenCalledWith(dynamoInput)
  })

  it('returns items in correct format', async () => {
    expect(await batchGet.execute(input)).toEqual({
      data: [
        { id: '1', name: 'John' },
        { id: '2', name: 'Doe' },
        { id: '3', name: 'Ronaldinho' },
      ],
    })
  })

  // @ts-ignore
  context('when dynamoClient returns no response', () => {
    beforeEach(() => {
      dynamoClient.batchGetItem.mockImplementationOnce(() => ({
        promise: async () => ({ Responses: undefined }),
      }))
    })

    it('returns empty data', async () => {
      expect(await batchGet.execute(input)).toEqual({ data: [] })
    })
  })

  // @ts-ignore
  context('when withAttributes option is passed', () => {
    beforeEach(() => {
      input.withAttributes = ['id', 'email']
      helpers.withAttributesGenerator.generateExpression
        .mockImplementationOnce(() => ({
          expressionAttributeNames: { '#id': 'id', '#email': 'email' },
          projectionExpression: '#id,#email',
        }))
    })
    it('only asks dynamoClient for the given attributes', async () => {
      await batchGet.execute(input)
      expect(dynamoClient.batchGetItem.mock.calls[0][0]).toMatchObject({
        RequestItems: {
          UserTable: {
            ProjectionExpression: '#id,#email',
            ExpressionAttributeNames: { '#id': 'id', '#email': 'email' },
          },
        },
      })
    })
  })

  // @ts-ignore
  context('when dynamoClient returns unprocessed items', () => {
    beforeEach(() => {
      dynamoClient.batchGetItem.mockImplementationOnce(() => ({
        promise: async () => ({
          Responses: {
            UserTable: [
              { id: { S: '1' }, name: { S: 'John' } },
            ],
          },
          UnprocessedKeys: {
            UserTable: {
              Keys: [
                { id: { S: '2' } },
                { id: { S: '3' } },
              ],
            },
          },
        })}))
        .mockImplementationOnce(() => ({
          promise: async () => ({
            Responses: {
              UserTable: [
                { id: { S: '2' }, name: { S: 'Doe' } },
              ],
            },
            UnprocessedKeys: {
              UserTable: {
                Keys: [
                  { id: { S: '3' } },
                ],
              },
            },
          })}))
        .mockImplementationOnce(() => ({
          promise: async () => ({
            Responses: {
              UserTable: [
                { id: { S: '3' }, name: { S: 'Ronaldinho' } },
              ],
            },
          }),
      }))
    })

    it('calls dynamoClient until all items are processed', async () => {
      await batchGet.execute(input)
      expect(dynamoClient.batchGetItem).toHaveBeenCalledTimes(3)
      expect(dynamoClient.batchGetItem.mock.calls).toEqual([[{
        RequestItems: {
          UserTable: {
            Keys: [{ id: { S: '1'} }, { id: { S: '2' } }, { id: { S: '3' } }],
          },
        },
      }], [{
        RequestItems: {
          UserTable: {
            Keys: [{ id: { S: '2'} }, { id: { S: '3' } }],
          },
        },
      }], [{
        RequestItems: {
          UserTable: {
            Keys: [{ id: { S: '3' } }],
          },
        },
      }]])
    })

    it('concats result for each call and return them', async () => {
      expect(await batchGet.execute(input)).toEqual({
        data: [
          { id: '1', name: 'John' },
          { id: '2', name: 'Doe' },
          { id: '3', name: 'Ronaldinho' },
        ],
      })
    })
  })

  // @ts-ignore
  context('when more than 100 items are requested at once', () => {
    const generateArrayOfIds = (size: number) => [
      ...Array(size).keys()].map(
        (index) => ({ id: index.toString() }),
    ) // [{ id: 1 }, { id: 2 }, { id: 3 }, ..., { id: size }]

    beforeEach(() => {
      input.keys = generateArrayOfIds(150)
    })

    it('splits into multiple requests', async () => {
      await batchGet.execute(input)
      expect(dynamoClient.batchGetItem).toHaveBeenCalledTimes(2)
      expect(dynamoClient.batchGetItem.mock.calls[0][0]
        .RequestItems.UserTable.Keys.length,
      ).toBe(100)
      expect(dynamoClient.batchGetItem.mock.calls[1][0]
        .RequestItems.UserTable.Keys.length,
      ).toBe(50)
    })
  })

  // @ts-ignore
  context('when provisioned throughput is exceeded', () => {
    beforeEach(() => {
      dynamoClient.batchGetItem.mockImplementationOnce(() => ({
        promise: async () => {
          const error: AWSError = {
            code: 'ProvisionedThroughputExceededException',
            message: 'Provisioned throughput was exceeded',
            statusCode: 400,
          } as any
          throw error
        },
      }))
    })

    it('tries again using a back-off algorithm', async () => {
      await batchGet.execute(input)
      expect(dynamoClient.batchGetItem).toHaveBeenCalledTimes(2)
    })
  })

  // @ts-ignore
  context('when Dynamo throws an unhandled error', () => {
    beforeEach(() => {
      dynamoClient.batchGetItem.mockImplementationOnce(() => ({
        promise: async () => { throw new Error('Unknown error') },
      }))
    })

    it('throws the unhandled error ', async () => {
      expect(batchGet.execute(input)).rejects.toThrow('Unknown error')
    })
  })
})
