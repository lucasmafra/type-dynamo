import { Initializer } from './initializer'
import DynamoClient from './operations/dynamo-client'
import {
  DefineTableWithCompositeKey,
} from './schema/define-table/define-table-with-composite-key'
import {
  DefineTableWithSimpleKey,
} from './schema/define-table/define-table-with-simple-key'
import {
  ICompositeKeySchema, IOperations, ISdkOptions, ISimpleKeySchema,
} from './types'

export class TypeDynamo {
  public dynamoClient: DynamoClient
  private operations: IOperations

  constructor(sdkOptions: ISdkOptions) {
    this.dynamoClient = Initializer.initializeDynamoClient(sdkOptions)
    this.operations = Initializer.initializeOperations(this.dynamoClient)
  }

  public define<Model, PartitionKey extends keyof Model>(
    table: { new(): Model }, schema: ISimpleKeySchema<PartitionKey>,
  ): DefineTableWithSimpleKey<Model, PartitionKey>

  public define<Model, PartitionKey extends keyof Model,
    SortKey extends keyof Model>(
    table: { new(): Model }, schema: ICompositeKeySchema<PartitionKey, SortKey>,
  ): DefineTableWithCompositeKey<Model, PartitionKey, SortKey>

  public define(table: any, schema: any) {
    const { tableName } = schema
    if (schema.sortKey) {
      return new DefineTableWithCompositeKey(tableName, this.operations)
    } else {
      return new DefineTableWithSimpleKey(tableName, this.operations)
    }
  }
}
