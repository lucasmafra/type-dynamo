import { IScanInput } from '../types'
import { ScanChaining } from './scan-chaining'
import objectContaining = jasmine.objectContaining

interface IUserModel { id: string, name: string, email: string }
interface IUserKeySchema { id: string }

describe('ScanChaining', () => {
  let user: IUserModel
  let scanOperation: any
  let input: IScanInput<IUserKeySchema>
  let scanChaining: ScanChaining<IUserModel, IUserKeySchema>

  beforeEach(() => {
    user = { id: '1', name: 'John Doe', email: 'john_doe@email.com'}
    scanOperation = { execute: jest.fn(() => ({ data: [user] })) }
    input = { tableName: 'UserTable' }
    scanChaining = new ScanChaining(scanOperation, input)
  })

  it('calls scanOperation correctly', async () => {
    const result = await scanChaining.execute()
    expect(scanOperation.execute).toHaveBeenCalledWith(input)
    expect(result).toEqual({ data: [user] })
  })

  // @ts-ignore
  context('when paginate', () => {
    it('adds pagination to input', async () => {
      await scanChaining
        .paginate(50, { id: '1' })
        .execute()

      expect(scanOperation.execute).toHaveBeenCalledWith(objectContaining({
        paginate: { limit: 50, lastKey: { id: '1' } },
      }))
    })
  })

  // @ts-ignore
  context('when allResults', () => {
    it('adds allResults to input', async () => {
      await scanChaining
        .allResults()
        .execute()

      expect(scanOperation.execute).toHaveBeenCalledWith(objectContaining({
        allResults: true,
      }))
    })
  })

  // @ts-ignore
  context('when withAttributes', () => {
    it('adds withAttributes to input', async () => {
      await scanChaining
        .withAttributes(['name'])
        .execute()

      expect(scanOperation.execute).toHaveBeenCalledWith(objectContaining({
        withAttributes: ['name'],
      }))
    })
  })

  // @ts-ignore
  context('filter', () => {
    it('adds filter to input', () => {
      pending('not implemented yet')
    })
  })
})
