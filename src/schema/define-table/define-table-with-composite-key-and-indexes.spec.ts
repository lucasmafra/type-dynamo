import { DynamoIndexWithCompositeKey } from '../dynamo-index/dynamo-index-with-composite-key'
import {
  DynamoIndexWithSimpleKey,
} from '../dynamo-index/dynamo-index-with-simple-key'
import {
  DynamoTableWithCompositeKeyAndIndexes,
} from '../dynamo-table/dynamo-table-with-composite-key-and-indexes'
import {
  DefineTableWithCompositeKeyAndIndexes,
} from './define-table-with-composite-key-and-indexes'
import anything = jasmine.anything

interface IOrderModel { orderId: string, customerId: string, total: number }
type OrderPartitionKey = 'orderId'
type OrderSortKey = 'customerId'

type ICustomerIndexPartitionKey = 'customerId'
interface ICustomerIndex {
  customerIndex: DynamoIndexWithSimpleKey<
    IOrderModel, ICustomerIndexPartitionKey>
}

describe('DefineTableWithCompositeKeyAndIndexes', () => {
  let operations: any
  let customerIndex: ICustomerIndex
  let defineTableWithCompositeKeyAndIndexes:
    DefineTableWithCompositeKeyAndIndexes<IOrderModel, OrderPartitionKey,
      OrderSortKey, ICustomerIndex, {}>

  beforeEach(() => {
    operations = {}
    customerIndex = {
      customerIndex: new DynamoIndexWithSimpleKey(
        'OrdersTable', 'customerIndex', operations,
      ),
    }
    defineTableWithCompositeKeyAndIndexes =
      new DefineTableWithCompositeKeyAndIndexes(
      'OrdersTable', customerIndex, {}, operations,
    )
  })

  describe('getInstance', () => {
    it('returns DynamoTableWithCompositeKeyAndIndexes', () => {
      expect(
        defineTableWithCompositeKeyAndIndexes
          .getInstance(),
      ).toBeInstanceOf(DynamoTableWithCompositeKeyAndIndexes)
    })
  })

  describe('withGlobalIndex', () => {
    it('returns class instance', () => {
      expect(
        defineTableWithCompositeKeyAndIndexes
          .withGlobalIndex({
            indexName: 'customerIndex',
            partitionKey: 'customerId',
            projectionType: 'ALL',
          }),
      ).toBeInstanceOf(DefineTableWithCompositeKeyAndIndexes)
    })

    it('appends index to current indexes', () => {
      expect(defineTableWithCompositeKeyAndIndexes
        .withGlobalIndex({
          indexName: 'customerIndex2',
          partitionKey: 'customerId',
          projectionType: 'ALL',
        })
        .getInstance()
        .onIndex,
      ).toEqual({
        customerIndex: anything(),
        customerIndex2: anything(),
      })
    })

    // @ts-ignore
    context('when index configuration has only partition key', () => {
      it('defines a DynamoIndexWithSimpleKey', () => {
        expect(
          defineTableWithCompositeKeyAndIndexes
            .withGlobalIndex({
              indexName: 'customerIndex2',
              partitionKey: 'customerId',
              projectionType: 'ALL',
            })
            .getInstance()
            .onIndex.customerIndex2,
        ).toBeInstanceOf(DynamoIndexWithSimpleKey)
      })
    })

    // @ts-ignore
    context('when index configuration has both partition and sort keys', () => {
      it('defines a DynamoIndexWithCompositeKey', () => {
        expect(
          defineTableWithCompositeKeyAndIndexes
            .withGlobalIndex({
              indexName: 'customerIndex2',
              partitionKey: 'customerId',
              sortKey: 'orderId',
              projectionType: 'ALL',
            })
            .getInstance()
            .onIndex.customerIndex2,
        ).toBeInstanceOf(DynamoIndexWithCompositeKey)
      })
    })
  })
})
