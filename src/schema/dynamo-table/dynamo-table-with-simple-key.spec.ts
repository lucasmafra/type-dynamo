import { BatchGetChaining } from '../../chaining/batch-get-chaining'
import { BatchWriteChaining } from '../../chaining/batch-write-chaining'
import { GetChaining } from '../../chaining/get-chaining'
import { PutChaining } from '../../chaining/put-chaining'
import { ScanChaining } from '../../chaining/scan-chaining'
import { DynamoTableWithSimpleKey } from './dynamo-table-with-simple-key'

interface IUserModel { id: string, name: string }
interface IUserPartitionKey { id: string }

describe('DynamoTableWithSimpleKey', () => {
  let dynamoTableWithSimpleKey: DynamoTableWithSimpleKey<
    IUserModel, IUserPartitionKey>
  let operations: any

  beforeEach(() => {
    operations = { }
    dynamoTableWithSimpleKey = new DynamoTableWithSimpleKey(
      'UserTable', operations,
    )
  })

  describe('find', () => {
    // @ts-ignore
    context('when no args is present', () => {
      it('calls scan', () => {
        expect(dynamoTableWithSimpleKey.find()).toBeInstanceOf(ScanChaining)
      })
    })

    // @ts-ignore
    context('when an array of keys is passed as args', () => {
      const keys = [{ id: '1' }, { id: '2'}]
      it('calls BatchGet', () => {
        expect(dynamoTableWithSimpleKey.find(keys))
          .toBeInstanceOf(BatchGetChaining)
      })
    })

    // @ts-ignore
    context('when a single is passed as args', () => {
      const key = { id: '1' }
      it('calls Get', () => {
        expect(dynamoTableWithSimpleKey.find(key))
          .toBeInstanceOf(GetChaining)
      })
    })
  })

  describe('save', () => {
    // @ts-ignore
    context('when only one item is passed', () => {
      const item = { id: '1', name: 'Fausto' }

      it('returns PutChaining', () => {
        expect(dynamoTableWithSimpleKey.save(item))
          .toBeInstanceOf(PutChaining)
      })
    })

    // @ts-ignore
    context('when multiple items are passed', () => {
      const items = [{ id: '1', name: 'Fausto' }, { id: '2', name: 'Silva' }]

      it('returns BatchWriteChaining', () => {
        expect(dynamoTableWithSimpleKey.save(items))
          .toBeInstanceOf(BatchWriteChaining)
      })
    })
  })
})
