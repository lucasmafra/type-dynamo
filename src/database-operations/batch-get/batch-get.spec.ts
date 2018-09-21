import { AWSError, DynamoDB } from 'aws-sdk'
import { IBatchGetInput } from './batch-get'
import { BatchGet } from './batch-get'
import anything = jasmine.anything

interface IUserModel { id: string, name: string }
interface IUserKeySchema { id: string }

let batchGet: BatchGet<IUserModel, IUserKeySchema>

const dynamoClient = {
  batchGet: jest.fn(async () => ({
    Responses: {
      UserTable: [
        { id: { S: '1' }, name: { S: 'John' } },
        { id: { S: '2' }, name: { S: 'Doe' } },
        { id: { S: '3'}, name: { S: 'Ronaldinho' } },
      ],
    },
  })),
}

const input: IBatchGetInput<IUserKeySchema> = {
  schema: { tableName: 'UserTable', dynamoPromise: dynamoClient as any },
  keys: [{ id: '1' }, { id: '2' }, { id: '3' }],
}

describe('BatchGet', () => {
  beforeEach(() => {
    batchGet = new BatchGet<IUserModel, IUserKeySchema>()
    dynamoClient.batchGet.mockClear()
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
    expect(dynamoClient.batchGet).toHaveBeenCalledWith(dynamoInput)
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

  context('when dynamoClient returns no response', () => {
    beforeEach(() => {
      dynamoClient.batchGet.mockImplementationOnce(() => ({
        Responses: undefined,
      }))
    })

    it('returns empty data', async () => {
      expect(await batchGet.execute(input)).toEqual({ data: [] })
    })
  })

  context('when withAttributes option is passed', () => {
    it('only asks dynamoClient for the given attributes', async () => {
      await batchGet.execute(input, { withAttributes: ['id'] })
      expect(dynamoClient.batchGet.mock.calls[0][0]).toMatchObject({
        RequestItems: {
          UserTable: {
            ProjectionExpression: anything(),
            ExpressionAttributeNames: anything(),
          },
        },
      })
    })
  })

  context('when dynamoClient returns unprocessed items', () => {
    beforeEach(() => {
      dynamoClient.batchGet.mockImplementationOnce(() => ({
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
      })).mockImplementationOnce(() => ({
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
      })).mockImplementationOnce(() => ({
        Responses: {
          UserTable: [
            { id: { S: '3' }, name: { S: 'Ronaldinho' } },
          ],
        },
      }))
    })

    it('calls dynamoClient until all items are processed', async () => {
      await batchGet.execute(input)
      expect(dynamoClient.batchGet).toHaveBeenCalledTimes(3)
      expect(dynamoClient.batchGet.mock.calls).toEqual([[{
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
      expect(dynamoClient.batchGet).toHaveBeenCalledTimes(2)
      expect(dynamoClient.batchGet.mock.calls[0][0]
        .RequestItems.UserTable.Keys.length,
      ).toBe(100)
      expect(dynamoClient.batchGet.mock.calls[1][0]
        .RequestItems.UserTable.Keys.length,
      ).toBe(50)
    })
  })

  context('when provisioned throughput is exceeded', () => {
    beforeEach(() => {
      dynamoClient.batchGet.mockImplementationOnce(() => {
        const error: AWSError = {
          code: 'ProvisionedThroughputExceededException',
          message: 'Provisioned throughput was exceeded',
          statusCode: 400,
        } as any
        throw error
      })
    })

    it('tries again using a back-off algorithm', async () => {
      await batchGet.execute(input)
      expect(dynamoClient.batchGet).toHaveBeenCalledTimes(2)
    })
  })

  context('when a unhandled error is thrown', () => {
    beforeEach(() => {
      dynamoClient.batchGet.mockImplementationOnce(() => {
        throw new Error('Unknown error')
      })
    })

    it('throws the unhandled error ', async () => {
      expect(batchGet.execute(input)).rejects.toThrow('Unknown error')
    })
  })
})
