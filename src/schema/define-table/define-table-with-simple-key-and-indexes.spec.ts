import { DynamoIndexWithCompositeKey } from '../dynamo-index/dynamo-index-with-composite-key'
import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithSimpleKeyAndIndexes,
} from '../dynamo-table/dynamo-table-with-simple-key-and-indexes'
import {
  DefineTableWithSimpleKeyAndIndexes,
} from './define-table-with-simple-key-and-indexes'
import anything = jasmine.anything

interface IUserModel { id: string, email: string, name: string }
type UserPartitionKey = 'id'

interface IEmailIndexPartitionKey { email: string }
interface IEmailIndex {
  emailIndex: DynamoIndexWithSimpleKey<IUserModel, IEmailIndexPartitionKey>
}

describe('DefineTableWithSimpleKeyAndIndexes', () => {
  let operations: any
  let emailIndex: IEmailIndex
  let defineTableWithSimpleKeyAndIndexes: DefineTableWithSimpleKeyAndIndexes<
    IUserModel, UserPartitionKey, IEmailIndex, {}
    >

  beforeEach(() => {
    operations = {} as any
    emailIndex = {
      emailIndex: new DynamoIndexWithSimpleKey(
        'UserTable', 'emailIndex', operations),
    }
    defineTableWithSimpleKeyAndIndexes = new DefineTableWithSimpleKeyAndIndexes(
      'UserTable', emailIndex, {}, operations,
    )
  })

  describe('getInstance', () => {
    it('returns DynamoTableWithSimpleKeyAndIndexes', () => {
      expect(
        defineTableWithSimpleKeyAndIndexes.getInstance(),
      ).toBeInstanceOf(DynamoTableWithSimpleKeyAndIndexes)
    })
  })

  describe('withGlobalIndexes', () => {
    it('returns class instance', () => {
      expect(
        defineTableWithSimpleKeyAndIndexes
          .withGlobalIndex({
            indexName: 'emailIndex',
            partitionKey: 'email',
            projectionType: 'ALL',
          }),
      ).toBeInstanceOf(DefineTableWithSimpleKeyAndIndexes)
    })

    it('appends new index on current indexes', () => {
      expect(
        defineTableWithSimpleKeyAndIndexes
          .withGlobalIndex({
            indexName: 'emailIndex2',
            partitionKey: 'email',
            projectionType: 'ALL',
          })
          .getInstance()
          .onIndex,
      ).toEqual({
        emailIndex: anything(),
        emailIndex2: anything(),
      })
    })

    // @ts-ignore
    context('when configuration has only partition key', () => {
      it('defines DynamoIndexWithSimpleKey', () => {
        expect(
          defineTableWithSimpleKeyAndIndexes
            .withGlobalIndex({
              indexName: 'emailIndex2',
              partitionKey: 'email',
              projectionType: 'ALL',
            })
            .getInstance()
            .onIndex.emailIndex2,
        ).toBeInstanceOf(DynamoIndexWithSimpleKey)
      })
    })

    // @ts-ignore
    context('when configuration has both partition and sort keys', () => {
      it('defines DynamoIndexWithCompositeKey', () => {
        expect(
          defineTableWithSimpleKeyAndIndexes
            .withGlobalIndex({
              indexName: 'emailIndex2',
              partitionKey: 'email',
              sortKey: 'id',
              projectionType: 'ALL',
            })
            .getInstance()
            .onIndex.emailIndex2,
        ).toBeInstanceOf(DynamoIndexWithCompositeKey)
      })
    })
  })
})
