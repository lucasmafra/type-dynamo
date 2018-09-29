import { IQueryInput } from '../../types'
import { QueryChaining } from './query-chaining'
import objectContaining = jasmine.objectContaining

interface IFeedModel { userId: string, createdAt: number, content: string }
interface IFeedKeySchema { userId: string, createdAt: number }
interface IFeedPartitionKey { userId: string }
interface IFeedSortKey { createdAt: number }

describe('QueryChaining', () => {
  let post: IFeedModel
  let queryOperation: any  = { execute: jest.fn() }
  let input: IQueryInput<IFeedKeySchema, IFeedPartitionKey>
  let queryChaining: QueryChaining<
    IFeedModel, IFeedPartitionKey, IFeedSortKey, IFeedKeySchema>

  beforeEach(() => {
    post = { userId: '1', createdAt: 1234, content: 'Hello, World'}
    queryOperation = { execute: jest.fn(() => ({ data: [post] })) }
    input = { tableName: 'FeedTable',  partitionKey: { userId: '1' } }
    queryChaining = new QueryChaining(queryOperation, input)
  })

  it('calls queryOperation correctly', async () => {
    const result = await queryChaining.execute()
    expect(queryOperation.execute).toHaveBeenCalledWith(input)
    expect(result).toEqual({
      data: [post],
    })
  })

  context('when paginate', () => {
    it('adds pagination to input', async () => {
      await queryChaining
        .paginate(50, { userId: '1', createdAt: 123 })
        .execute()
      expect(queryOperation.execute).toHaveBeenCalledWith(objectContaining({
        paginate: { limit: 50, lastKey: { userId: '1', createdAt: 123 } },
      }))
    })
  })

  context('when allResults', () => {
    it('adds allResults to input', async () => {
      await queryChaining
        .allResults()
        .execute()

      expect(queryOperation.execute).toHaveBeenCalledWith(objectContaining({
        allResults: true,
      }))
    })
  })

  context('when withAttributes', () => {
    it('adds withAttributes to input', async () => {
      await queryChaining
        .withAttributes(['content'])
        .execute()

      expect(queryOperation.execute).toHaveBeenCalledWith(objectContaining({
        withAttributes: ['content'],
      }))
    })
  })

  context('when withSortKeyCondition', () => {
    it('adds withSortKeyCondition to input', () => {
      pending('not implemented yet')
    })
  })

  context('when filter', () => {
    it('adds filter to input', () => {
      pending('not implemented yet')
    })
  })

  context('when withOptions', () => {
    it('adds withOptions to input', () => {
      pending('not implemented yet')
    })
  })
})
