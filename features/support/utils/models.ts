import { DynamoTableWithCompositeKey } from '../../../src/schema/dynamo-table/dynamo-table-with-composite-key'
import { DynamoTableWithSimpleKey } from '../../../src/schema/dynamo-table/dynamo-table-with-simple-key'
import { DynamoIndexWithCompositeKey } from '../../../src/schema/dynamo-index/dynamo-index-with-composite-key'
import { DynamoTableWithCompositeKeyAndIndexes } from '../../../src/schema/dynamo-table/dynamo-table-with-composite-key-and-indexes'
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

export const StudentClass = typeDynamo.define(class {
  public student: string
  public class: string
}, {
  tableName: 'StudentClassTable',
  partitionKey: 'student',
  sortKey: 'class',
})
  .withGlobalIndex({
    indexName: 'classIndex',
    partitionKey: 'class',
    sortKey: 'student',
    projectionType: 'KEYS_ONLY',
  })
  .getInstance()
