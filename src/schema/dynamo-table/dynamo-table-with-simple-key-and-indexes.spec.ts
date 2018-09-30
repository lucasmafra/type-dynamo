import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithSimpleKeyAndIndexes,
} from './dynamo-table-with-simple-key-and-indexes'

interface IUserModel { id: string, name: string, email: string }
interface IUserPartitionKey { id: string }
interface IEmailIndexModel { email: string, id: string }
interface IEmailIndexPartitionKey { email: string }
interface IEmailIndex { emailIndex: DynamoIndexWithSimpleKey<
  IEmailIndexModel, IEmailIndexPartitionKey> }

describe('DynamoTableWithSimpleKeyAndIndexes', () => {
  let emailIndex: IEmailIndex
  let operations: any
  let dynamoTableWithSimpleKeyAndIndexes: DynamoTableWithSimpleKeyAndIndexes<
    IUserModel, IUserPartitionKey, IEmailIndex, {}
  >

  beforeEach(() => {
    operations = {}
    emailIndex = { emailIndex: new DynamoIndexWithSimpleKey(
      'UserTable',
      'emailIndex',
      operations,
    ) }
    dynamoTableWithSimpleKeyAndIndexes = new DynamoTableWithSimpleKeyAndIndexes(
      'UserTable', emailIndex, {}, operations,
    )
  })

  it('assigns given indexes to onIndex property', () => {
    expect(dynamoTableWithSimpleKeyAndIndexes.onIndex.emailIndex)
      .toBeInstanceOf(DynamoIndexWithSimpleKey)
  })
})
