import { QueryChaining } from '../../chaining/query-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { DynamoIndexWithSimpleKey } from './dynamo-index-with-simple-key'

interface IEmailIndex { email: string, userId: string, name: string }
interface IEmailIndexPartitionKey { email: string }

describe('DynamoIndexWithSimpleKey', () => {
  let dynamoIndexWithSimpleKey: DynamoIndexWithSimpleKey<
    IEmailIndex, IEmailIndexPartitionKey>
  let operations: any

  beforeEach(() => {
    operations = {}
    dynamoIndexWithSimpleKey = new DynamoIndexWithSimpleKey(
      'UserTable', 'emailIndex', operations,
    )
  })

  describe('find', () => {
    // @ts-ignore
    context('when no args is present', () => {
      it('calls Scan', () => {
        expect(dynamoIndexWithSimpleKey.find())
          .toBeInstanceOf(ScanChaining)
      })
    })

    // @ts-ignore
    context('when the partition key is passed as args', () => {
      const key = { email: 'johndoe@email.com'}

      it('calls Query', () => {
        expect(dynamoIndexWithSimpleKey.find(key))
          .toBeInstanceOf(QueryChaining)
      })
    })
  })
})
