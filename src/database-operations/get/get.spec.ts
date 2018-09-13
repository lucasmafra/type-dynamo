import { DynamoDB } from 'aws-sdk'
import { get } from './get'

describe('get', () => {
  const dynamoClient = {
    getItem: jest.fn(async () => ({
      Item: { id: { S: '1' }, name: { S: 'John Doe' } },
    })),
  }

  const input: DynamoDB.GetItemInput = {
    TableName: 'DummyTable',
    Key: { id: { S: '1' } },
  }

  it('gets item using dynamoClient', () => {
    get(input, dynamoClient as any)
    expect(dynamoClient.getItem).toHaveBeenCalledWith(input)
  })

  context('when dynamoClient returns no item', () => {
    beforeEach(() => {
      dynamoClient.getItem.mockImplementationOnce(
        async () => ({ Item: undefined }),
      )
    })

    it('throws ItemNotFound error', async () => {
      expect(get(input, dynamoClient as any))
        .rejects.toThrow('ItemNotFound')
    })
  })
})
