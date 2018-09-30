import {
  DefineTableWithCompositeKey,
} from './schema/define-table/define-table-with-composite-key'
import {
  DefineTableWithSimpleKey,
} from './schema/define-table/define-table-with-simple-key'
import { TypeDynamo } from './type-dynamo'

describe('TypeDynamo', () => {
  let typeDynamo: TypeDynamo

  beforeEach(() => {
    typeDynamo = new TypeDynamo({ region: 'us-east-1' })
  })

  describe('define', () => {
    // @ts-ignore
    context('when schema has only partition key', () => {
      class User {
        public id: string
        public email: string
      }

      it('returns DefineTableWithSimpleKey', () => {
        expect(
          typeDynamo.define(User, {
            tableName: 'UserTable',
            partitionKey: 'id',
          }),
        ).toBeInstanceOf(DefineTableWithSimpleKey)
      })
    })

    // @ts-ignore
    context('when schema has both partition and sort keys', () => {
      class Order {
        public orderId: string
        public customerId: string
        public total: number
      }

      it('returns DefineTableWithCompositeKey', () => {
        expect(
          typeDynamo.define(Order, {
            tableName: 'OrderTable',
            partitionKey: 'orderId',
            sortKey: 'customerId',
          }),
        ).toBeInstanceOf(DefineTableWithCompositeKey)
      })
    })
  })
})
