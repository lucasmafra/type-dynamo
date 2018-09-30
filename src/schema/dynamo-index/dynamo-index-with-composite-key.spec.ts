import { QueryChaining } from '../../chaining/query-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { DynamoIndexWithCompositeKey } from './dynamo-index-with-composite-key'

interface ICompanyIndexModel {
  userId: string, companyId: string, content: string
}
interface ICompanyIndexPartitionKey { companyId: string }
interface ICompanyIndexSortKey { userId: string }

describe('DynamoIndexWithCompositeKey', () => {
  let dynamoIndexWithCompositeKey: DynamoIndexWithCompositeKey<
    ICompanyIndexModel, ICompanyIndexPartitionKey, ICompanyIndexSortKey>
  let operations: any

  beforeEach(() => {
    operations = {}
    dynamoIndexWithCompositeKey = new DynamoIndexWithCompositeKey(
      'FeedTable', 'companyIndex', operations,
    )
  })

  describe('find', () => {
    context('when no args is present', () => {
      it('calls Scan', () => {
        expect(dynamoIndexWithCompositeKey.find())
          .toBeInstanceOf(ScanChaining)
      })
    })

    context('when the partition key is passed as args', () => {
      const key = { companyId: '1' }

      it('calls Query', () => {
        expect(dynamoIndexWithCompositeKey.find(key))
          .toBeInstanceOf(QueryChaining)
      })
    })
  })
})
