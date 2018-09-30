import { BatchGetChaining } from '../../chaining/batch-get-chaining'
import { GetChaining } from '../../chaining/get-chaining'
import { QueryChaining } from '../../chaining/query-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { DynamoTableWithCompositeKey } from './dynamo-table-with-composite-key'

interface IFeedModel { userId: string, createdAt: number, content: string }
interface IFeedPartitionKey { userId: string }
interface IFeedSortKey { createdAt: number }

describe('DynamoTableWithSimpleKey', () => {
  let dynamoTableWithCompositeKey: DynamoTableWithCompositeKey<
      IFeedModel, IFeedPartitionKey, IFeedSortKey>
  let operations: any

  beforeEach(() => {
    operations = { }
    dynamoTableWithCompositeKey = new DynamoTableWithCompositeKey(
      'FeedTable', operations,
    )
  })

  describe('find', () => {
    // @ts-ignore
    context('when no args is present', () => {
      it('calls scan', () => {
        expect(dynamoTableWithCompositeKey.find()).toBeInstanceOf(ScanChaining)
      })
    })

    // @ts-ignore
    context('when an array of keys is passed as args', () => {
      const keys = [{userId: '1', createdAt: 1}, {userId: '1', createdAt: 2}]
      it('calls BatchGet', () => {
        expect(dynamoTableWithCompositeKey.find(keys))
          .toBeInstanceOf(BatchGetChaining)
      })
    })

    // @ts-ignore
    context('when a single key is passed as args with ' +
      'both partition and sort key', () => {
      const key = { userId: '1', createdAt: 1 }
      it('calls Get', () => {
        expect(dynamoTableWithCompositeKey.find(key))
          .toBeInstanceOf(GetChaining)
      })
    })

    // @ts-ignore
    context('when a single key is passed as args with ' +
      'just partition key', () => {
      const key = { userId: '1' }
      it('calls Query', () => {
        expect(dynamoTableWithCompositeKey.find(key))
          .toBeInstanceOf(QueryChaining)
      })
    })
  })
})
