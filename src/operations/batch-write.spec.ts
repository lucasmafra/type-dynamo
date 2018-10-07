import { IBatchWriteInput } from '../types'
import { BatchWrite } from './batch-write'

describe('BatchWrite', () => {
  let dynamoClient: any
  let batchWrite: BatchWrite
  let input: IBatchWriteInput<any>
  let helpers: any

  beforeEach(() => {
    input = {
      tableName: 'DummyTable',
      items: [
        {id: '1', email: 'john@email.com'},
        {id: '2', email: 'doe@email.com'},
      ],
    }
    dynamoClient = {
      batchWriteItem: jest.fn(() => ({
        promise: async () => ({}),
      })),
    }
    helpers = {
      timeout: {wait: jest.fn()},
    }
    batchWrite = new BatchWrite(dynamoClient as any, helpers as any)
  })

  it('calls dynamoClient correctly', async () => {
    await batchWrite.execute(input)
    expect(dynamoClient.batchWriteItem).toHaveBeenCalledWith({
      RequestItems: {
        DummyTable: [{
          PutRequest: {
            Item: {id: {S: '1'}, email: {S: 'john@email.com'}},
          },
        }, {
          PutRequest: {
            Item: {id: {S: '2'}, email: {S: 'doe@email.com'}},
          },
        }],
      },
    })
  })

  it('returns items in correct format', async () => {
    expect(await batchWrite.execute(input)).toEqual({
      data: [
        {id: '1', email: 'john@email.com'},
        {id: '2', email: 'doe@email.com'},
      ],
    })
  })

  // @ts-ignore
  context('when more than 25 items are requested', () => {
    const generateFakeItems = (total: number) => {
      const items = []
      for (let i = 0; i < total; i++) {
        items.push({id: i.toString(), email: `${i}@email.com`})
      }
      return items
    }

    beforeEach(() => {
      input.items = generateFakeItems(77)
    })

    it('splits requests into chunks of max of 25 items each', async () => {
      await batchWrite.execute(input)
      expect(dynamoClient.batchWriteItem.mock.calls).toMatchSnapshot()
    })

    it('calls dynamoClient for each chunk', async () => {
      await batchWrite.execute(input)
      expect(dynamoClient.batchWriteItem).toHaveBeenCalledTimes(4)
    })
  })

  // @ts-ignore
  context('when dynamoClient returns UnprocessedItems', () => {
    beforeEach(() => {
      dynamoClient.batchWriteItem.mockReset()
      dynamoClient.batchWriteItem
        .mockImplementationOnce(() => ({
          promise: async () => ({
            UnprocessedItems: {
              DummyTable: [
                {PutRequest: {Item: {id: '1', email: '1@email.com'}}},
                {PutRequest: {Item: {id: '2', email: '2@email.com'}}},
                {PutRequest: {Item: {id: '3', email: '3@email.com'}}},
              ],
            },
          }),
        }))
        .mockImplementationOnce(() => ({
          promise: async () => ({
            UnprocessedItems: {
              DummyTable: [
                {PutRequest: {Item: {id: '2', email: '2@email.com'}}},
                {PutRequest: {Item: {id: '3', email: '3@email.com'}}},
              ],
            },
          }),
        }))
        .mockImplementationOnce(() => ({
          promise: async () => ({
            UnprocessedItems: {
              DummyTable: [
                {PutRequest: {Item: {id: '3', email: '3@email.com'}}},
              ],
            },
          }),
        }))
        .mockImplementationOnce(() => ({
          promise: async () => ({
            UnprocessedItems: {},
          }),
        }))
    })

    it('calls dynamoClient again until there is no more items to process',
      async () => {
        await batchWrite.execute(input)
        expect(dynamoClient.batchWriteItem).toHaveBeenCalledTimes(4)
      })

    it('uses the unprocessed items from the previous response to make the ' +
      'subsequent request', async () => {
      await batchWrite.execute(input)
      expect(dynamoClient.batchWriteItem).toHaveBeenNthCalledWith(2, ({
        RequestItems: {
          DummyTable: [
            {PutRequest: {Item: {id: '1', email: '1@email.com'}}},
            {PutRequest: {Item: {id: '2', email: '2@email.com'}}},
            {PutRequest: {Item: {id: '3', email: '3@email.com'}}},
          ],
        },
      }))
      expect(dynamoClient.batchWriteItem).toHaveBeenNthCalledWith(3, ({
        RequestItems: {
          DummyTable: [
            {PutRequest: {Item: {id: '2', email: '2@email.com'}}},
            {PutRequest: {Item: {id: '3', email: '3@email.com'}}},
          ],
        },
      }))
      expect(dynamoClient.batchWriteItem).toHaveBeenNthCalledWith(4, ({
        RequestItems: {
          DummyTable: [
            {PutRequest: {Item: {id: '3', email: '3@email.com'}}},
          ],
        },
      }))
    })
  })

  // @ts-ignore
  context('when provisioned throughput is exceeded', () => {
    beforeEach(() => {
      dynamoClient.batchWriteItem.mockReset()
      dynamoClient.batchWriteItem
        .mockImplementationOnce(() => ({
          promise: async () => {
            throw {
              code: 'ProvisionedThroughputExceededException',
              message: 'Provisioned throughput was exceeded',
              statusCode: 400,
            }
          },
        }))
        .mockImplementationOnce(() => ({
          promise: async () => ({}),
        }))
    })

    it('tries again using a exponential back-off algorithm', async () => {
      await batchWrite.execute(input)
      expect(dynamoClient.batchWriteItem).toHaveBeenCalledTimes(2)
    })
  })
})
