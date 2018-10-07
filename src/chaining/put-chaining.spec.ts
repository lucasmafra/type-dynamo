import { IPutInput } from '../types'
import { PutChaining } from './put-chaining'

interface IUserModel {
  id: string
  email: string
}

describe('PutChaining', () => {
  let input: IPutInput<IUserModel>
  let putOperation: any
  let putChaining: PutChaining<IUserModel>

  beforeEach(() => {
    input = {
      tableName: 'UserTable',
      item: { id: '1', email: '1@email.com' },
    }
    putOperation = { execute: jest.fn() }
    putChaining = new PutChaining(putOperation, input)
  })

  describe('execute', () => {
    it('calls putOperation', async () => {
      await putChaining.execute()
      expect(putOperation.execute).toHaveBeenCalledWith(input)
    })
  })
})
