import { IBatchGetInput } from '../types/index'
import { BatchGetChaining } from './batch-get-chaining'
import objectContaining = jasmine.objectContaining

interface IUserModel { id: string, email: string }
interface IUserKeySchema { id: string }

describe('BatchGetChaining', () => {
  const user: IUserModel = {id: 'fake-user-id', email: 'fake-user-email'}
  let batchGetOperation: any
  let input: IBatchGetInput<IUserKeySchema>
  let batchGetChaining: BatchGetChaining<IUserModel, IUserKeySchema>

  beforeEach(() => {
    batchGetOperation = {execute: jest.fn(() => ({data: [user]}))}
    input = {tableName: 'DummyTable', keys: [{id: '1'}]}
    batchGetChaining = new BatchGetChaining(batchGetOperation, input)
  })

  it('calls getOperation correctly', async () => {
    const {data} = await batchGetChaining.execute()
    expect(batchGetOperation.execute).toHaveBeenCalledWith(input)
    expect(data).toEqual([user])
  })

  // @ts-ignore
  context('withAttributes', () => {
    it('appends withAttributes to input ', async () => {
      await batchGetChaining.withAttributes(['email']).execute()
      expect(batchGetOperation.execute).toHaveBeenCalledWith(objectContaining({
        withAttributes: ['email'],
      }))
    })
  })
})
