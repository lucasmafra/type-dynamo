import { IGetInput } from '../../types'
import { GetChaining } from './get-chaining'
import objectContaining = jasmine.objectContaining

interface IUserModel { id: string, email: string }
interface IUserKeySchema { id: string }

describe('GetChaining', () => {
  const user: IUserModel = {id: 'fake-user-id', email: 'fake-user-email'}
  let getOperation: any
  let input: IGetInput<IUserKeySchema>
  let getChaining: GetChaining<IUserModel, IUserKeySchema>

  beforeEach(() => {
    getOperation = {execute: jest.fn(() => ({data: user}))}
    input = {tableName: 'DummyTable', key: {id: '1'}}
    getChaining = new GetChaining(getOperation, input)
  })

  it('calls getOperation correctly', async () => {
    const {data} = await getChaining.execute()
    expect(getOperation.execute).toHaveBeenCalledWith(input)
    expect(data).toEqual(user)
  })

  // @ts-ignore
  context('withAttributes', () => {
    it('appends withAttributes to input ', async () => {
      await getChaining.withAttributes(['email']).execute()
      expect(getOperation.execute).toHaveBeenCalledWith(objectContaining({
        withAttributes: ['email'],
      }))
    })
  })
})
