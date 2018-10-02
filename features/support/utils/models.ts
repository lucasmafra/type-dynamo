import { DynamoTableWithSimpleKey } from '../../../src/schema/dynamo-table/dynamo-table-with-simple-key'
import { DynamoTableWithCompositeKey } from '../../../src/schema/dynamo-table/dynamo-table-with-composite-key'
import { typeDynamo } from './type-dynamo'

export const User = typeDynamo.define(class {
  public id: string
  public name: string
}, {
  tableName: 'UserTable',
  partitionKey: 'id',
})
  .getInstance()

export const Order = typeDynamo.define(class {
  public orderId: string
  public userId: string
  public description: string
}, {
  tableName: 'OrderTable',
  partitionKey: 'userId',
  sortKey: 'orderId',
}).getInstance()
