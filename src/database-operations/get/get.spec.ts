import { DynamoDB } from 'aws-sdk'
import { IGetInput as IGet } from '../../chaining/find/get/get'
import { Get } from './get'

interface IUserModel { id: string, name: string }
interface IUserKeySchema { id: string }

let get: Get<IUserModel, IUserKeySchema>

const dynamoClient = {
  getItem: jest.fn(async () => ({
    Item: { id: { S: '1' }, name: { S: 'John Doe' } },
  })),
}

const input: IGet<IUserKeySchema> = {
  schema: { tableName: 'DummyTable', dynamoPromise: dynamoClient as any },
  key: { id: '1' },
}

describe('IGetInput', () => {
  beforeEach(() => {
    get = new Get()
    dynamoClient.getItem.mockClear()
  })

  it('gets item using dynamoClient', () => {
    const dynamoInput: DynamoDB.GetItemInput = {
      TableName: 'DummyTable', Key: { id: { S: '1' } },
    }
    get.execute(input)
    expect(dynamoClient.getItem).toHaveBeenCalledWith(dynamoInput)
  })

  context('when withAttributes option is present', () => {
    const withAttributes = {
      attributes: ['#id', '#name', '#email'],
      expressionAttributeNames: {
        '#id': 'id', '#name': 'name', '#email': 'email',
      },
    }

    it('calls dynamoClient with projection expression', () => {
      get.execute(input, { withAttributes })
      expect(dynamoClient.getItem.mock.calls[0][0]).toMatchObject({
        ProjectionExpression: '#id,#name,#email',
        ExpressionAttributeNames: {
          '#id': 'id', '#name': 'name', '#email': 'email',
        },
      })
    })
  })

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
