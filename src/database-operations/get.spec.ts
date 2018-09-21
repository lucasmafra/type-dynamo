import { DynamoDB } from 'aws-sdk'
import { IGetInput } from './get'
import { Get } from './get'
import anything = jasmine.anything

interface IUserModel { id: string, name: string }
interface IUserKeySchema { id: string }

let get: Get<IUserModel, IUserKeySchema>

const dynamoClient = {
  getItem: jest.fn(async () => ({
    Item: { id: { S: '1' }, name: { S: 'John Doe' } },
  })),
}

const input: IGetInput<IUserKeySchema> = {
  tableName: 'DummyTable',
  key: { id: '1' },
}

describe('Get', () => {
  beforeEach(() => {
    get = new Get(dynamoClient as any)
    dynamoClient.getItem.mockClear()
  })

  it('gets item using dynamoClient', () => {
    const dynamoInput: DynamoDB.GetItemInput = {
      TableName: 'DummyTable', Key: { id: { S: '1' } },
    }
    get.execute(input)
    expect(dynamoClient.getItem).toHaveBeenCalledWith(dynamoInput)
  })

  // @ts-ignore
  context('when withAttributes option is present', () => {
    const withAttributes = ['id']

    it('calls dynamoClient with projection expression', () => {
      get.execute(input, { withAttributes })
      expect(dynamoClient.getItem.mock.calls[0][0]).toMatchObject({
        ProjectionExpression: anything(),
        ExpressionAttributeNames: anything()
      })
    })
  })

  // @ts-ignore
  context('when dynamoClient returns no item', () => {
    beforeEach(() => {
      dynamoClient.getItem.mockImplementationOnce(
        async () => ({ Item: undefined }),
      )
    })

    it('throws ItemNotFound error', async () => {
      expect(get.execute(input))
        .rejects.toThrow('ItemNotFound')
    })
  })
})
