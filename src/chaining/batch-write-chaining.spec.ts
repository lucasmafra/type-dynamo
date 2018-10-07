import { IBatchWriteInput } from '../types'
import { BatchWriteChaining } from './batch-write-chaining'

interface IUserModel {
  id: string
  email: string
}

describe('BatchWriteChaining', () => {
  let input: IBatchWriteInput<IUserModel>
  let batchWriteOperation: any
  let batchWriteChaining: BatchWriteChaining<IUserModel>

  beforeEach(() => {
    input = {
      tableName: 'UserTable',
      items: [
        { id: '1', email: '1@email.com'},
        { id: '2', email: '2@email.com'},
      ],
    }
    batchWriteOperation = { execute: jest.fn() }
    batchWriteChaining = new BatchWriteChaining(batchWriteOperation, input)
  })

  describe('execute', () => {
    it('calls batchWriteOperation', async () => {
      await batchWriteChaining.execute()
      expect(batchWriteOperation.execute).toHaveBeenCalledWith(input)
    })
  })
})
