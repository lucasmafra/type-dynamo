import { IPutInput } from '../types'
import { Put } from './put'

describe('Put', () => {
  let dynamoClient: any
  let put: Put
  let input: IPutInput<any>

  beforeEach(() => {
    dynamoClient = {
      putItem: jest.fn(() => ({
        promise: async () => ({
          Attributes: { id: { S: '1' }, email: { S: 'john@email.com' } },
        }),
      })),
    }
    put = new Put(dynamoClient as any)
    input = {
      tableName: 'DummyTable', item: { id: '1', email: 'john@email.com' },
    }
  })

  it('calls dynamoClient correctly', async () => {
    await put.execute(input)
    expect(dynamoClient.putItem).toHaveBeenCalledWith({
      TableName: 'DummyTable',
      Item: { id: { S: '1' }, email: { S: 'john@email.com'} },
    })
  })

  it('returns saved item in correct format', async () => {
    expect(await put.execute(input)).toEqual({
      data: { id: '1', email: 'john@email.com' },
    })
  })
})
