import { BatchWrite, IBatchWriteInput } from './batch-write'

describe('BatchWrite', () => {
  let dynamoClient: any
  let batchWrite: BatchWrite
  let input: IBatchWriteInput<any>

  beforeEach(() => {
    input = {
      tableName: 'DummyTable',
      items: [
        { id: '1', email: 'john@email.com' },
        { id: '2', email: 'doe@email.com' },
      ],
    }
    dynamoClient = {
      batchWriteItem: jest.fn(() => ({
        promise: async () => null,
      })),
    }
    batchWrite = new BatchWrite(dynamoClient as any)
  })

  it('calls dynamoClient correctly', async () => {
    await batchWrite.execute(input)
    expect(dynamoClient.batchWriteItem).toHaveBeenCalledWith({
      RequestItems: {
        DummyTable: [{
          PutRequest: {
            Item: { id: { S: '1' }, email: { S: 'john@email.com' } },
          },
        }, {
          PutRequest: {
            Item: { id: { S: '2' }, email: { S: 'doe@email.com' } },
          },
        }],
      },
    })
  })

  it('returns items in correct format', async () => {
    expect(await batchWrite.execute(input)).toEqual({
      data: [
        { id: '1', email: 'john@email.com' },
        { id: '2', email: 'doe@email.com' },
      ],
    })
  })

  // @ts-ignore
  context('when more than 25 items are requested', () => {
    const generateFakeItems = (total: number) => {
      const items = []
      for (let i = 0; i < total; i++) {
        items.push({ id: i.toString(), email: `${i}@email.com`})
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
})
