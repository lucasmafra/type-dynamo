import {
  DynamoIndexWithCompositeKey,
} from '../dynamo-index/dynamo-index-with-composite-key'
import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithSimpleKey,
} from '../dynamo-table/dynamo-table-with-simple-key'
import { DefineTableWithSimpleKey } from './define-table-with-simple-key'

interface IUserModel { id: string, name: string, email: string }
type UserPartitionKey = 'id'

describe('DefineTableWithSimpleKey', () => {
  let operations: any
  let defineTableWithSimpleKey: DefineTableWithSimpleKey<
    IUserModel, UserPartitionKey>

  beforeEach(() => {
    operations = {}
    defineTableWithSimpleKey = new DefineTableWithSimpleKey(
      'UserTable', operations,
    )
  })

  describe('getInstance', () => {
    it('returns DynamoTableWithSimpleKey', () => {
      expect(defineTableWithSimpleKey.getInstance())
        .toBeInstanceOf(DynamoTableWithSimpleKey)
    })
  })

  describe('withGlobalIndex', () => {
    // @ts-ignore
    context('when configuration has only partition key', () => {
      it('defines DynamoIndexWithSimpleKey', () => {
        expect(
          defineTableWithSimpleKey
            .withGlobalIndex({
              indexName: 'emailIndex',
              partitionKey: 'email',
              projectionType: 'ALL',
            })
            .getInstance()
            .onIndex.emailIndex,
        ).toBeInstanceOf(DynamoIndexWithSimpleKey)
      })
    })

    // @ts-ignore
    context('when configuration has both partition and sort keys', () => {
      it('defines DynamoIndexWithCompositeKey', () => {
        expect(
          defineTableWithSimpleKey
            .withGlobalIndex({
              indexName: 'emailIndex',
              partitionKey: 'email',
              sortKey: 'id',
              projectionType: 'ALL',
            })
            .getInstance()
            .onIndex.emailIndex,
        ).toBeInstanceOf(DynamoIndexWithCompositeKey)
      })
    })
  })
})
