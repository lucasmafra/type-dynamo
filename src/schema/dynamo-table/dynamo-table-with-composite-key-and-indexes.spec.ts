import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithCompositeKeyAndIndexes,
} from './dynamo-table-with-composite-key-and-indexes'

interface IFeedModel {
  userId: string, companyId: string, createdAt: number, content: string
}
interface IFeedPartitionKey { userId: string }
interface IFeedSortKey { companyId: string }
interface ICompanyIndexModel { companyId: string, userId: string }
interface ICompanyIndexPartitionKey { companyId: string }
interface ICompanyIndex { companyIndex: DynamoIndexWithSimpleKey<
    ICompanyIndexModel, ICompanyIndexPartitionKey> }

describe('DynamoTableWithCompositeKeyAndIndexes', () => {
  let companyIndex: ICompanyIndex
  let operations: any
  let dynamoTableWithCompositeKeyAndIndexes:
    DynamoTableWithCompositeKeyAndIndexes<IFeedModel, IFeedPartitionKey,
      IFeedSortKey, ICompanyIndex, {}
    >

  beforeEach(() => {
    operations = {}
    companyIndex = { companyIndex: new DynamoIndexWithSimpleKey(
        'FeedTable',
        'companyIndex',
        operations,
      ) }
    dynamoTableWithCompositeKeyAndIndexes =
      new DynamoTableWithCompositeKeyAndIndexes(
      'FeedTable', companyIndex, {}, operations,
    )
  })

  it('assigns given indexes to onIndex property', () => {
    expect(dynamoTableWithCompositeKeyAndIndexes.onIndex.companyIndex)
      .toBeInstanceOf(DynamoIndexWithSimpleKey)
  })
})
