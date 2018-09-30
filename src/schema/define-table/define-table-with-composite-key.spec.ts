import {
  DynamoIndexWithCompositeKey,
} from '../dynamo-index/dynamo-index-with-composite-key'
import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithCompositeKey,
} from '../dynamo-table/dynamo-table-with-composite-key'
import { DefineTableWithCompositeKey } from './define-table-with-composite-key'

interface IOrderModel { orderId: string, customerId: string, total: number }
type OrderPartitionKey = 'orderId'
type OrderSortKey = 'customerId'

describe('DefineTableWithCompositeKey', () => {
  let operations: any
  let defineTableWithCompositeKey: DefineTableWithCompositeKey<
    IOrderModel, OrderPartitionKey, OrderSortKey>

  beforeEach(() => {
    operations = {}
    defineTableWithCompositeKey = new DefineTableWithCompositeKey(
      'OrdersTable', operations,
    )
  })

  describe('getInstance', () => {
    it('returns DynamoTableWithCompositeKey', () => {
      expect(
        defineTableWithCompositeKey
          .getInstance(),
      ).toBeInstanceOf(DynamoTableWithCompositeKey)
    })
  })

  describe('withGlobalIndex', () => {
    // @ts-ignore
    context('when index configuration has only partition key', () => {
      it('defines a DynamoIndexWithSimpleKey', () => {
        expect(
          defineTableWithCompositeKey
            .withGlobalIndex({
              indexName: 'customerIndex',
              partitionKey: 'customerId',
              projectionType: 'ALL',
            })
            .getInstance()
            .onIndex.customerIndex,
        ).toBeInstanceOf(DynamoIndexWithSimpleKey)
      })
    })

    // @ts-ignore
    context('when index configuration has both partition and sort keys', () => {
      it('defines a DynamoIndexWithCompositeKey', () => {
        expect(
          defineTableWithCompositeKey
            .withGlobalIndex({
              indexName: 'customerIndex',
              partitionKey: 'customerId',
              sortKey: 'orderId',
              projectionType: 'ALL',
            })
            .getInstance()
            .onIndex.customerIndex,
        ).toBeInstanceOf(DynamoIndexWithCompositeKey)
      })
    })
  })
})
