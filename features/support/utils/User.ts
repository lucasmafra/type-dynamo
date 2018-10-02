import {
  DynamoTableWithSimpleKey,
} from '../../../src/schema/dynamo-table/dynamo-table-with-simple-key'
import { typeDynamo } from './type-dynamo'

export const User = typeDynamo.define(class {
  public id: string
  public name: string
}, {
  tableName: 'UserTable',
  partitionKey: 'id',
})
  .getInstance()
