import { BatchGetChaining } from '../../chaining/find/batch-get'
import { GetChaining } from '../../chaining/find/get/get'
import { ScanChaining } from '../../chaining/find/scan/scan'
import DynamoClient from '../../operations/dynamo-client'
import { IHelpers, ITableSchema } from '../../types'

export class DynamoTableWithSimpleKey<Model, PartitionKey> {
  private tableSchema: ITableSchema
  private dynamoClient: DynamoClient
  private helpers: IHelpers

  constructor(
    tableSchema: ITableSchema,
    dynamoClient: DynamoClient,
    helpers: IHelpers,
  ) {
    this.tableSchema = tableSchema
    this.dynamoClient = dynamoClient
    this.helpers = helpers
  }

  public find(): ScanChaining<Model, PartitionKey>

  public find(keys: PartitionKey[]): BatchGetChaining<Model, PartitionKey>

  public find(key: PartitionKey): GetChaining<Model, PartitionKey>

  public find(args?: any): any {
    if (!args) {
      return new ScanChaining<Model, PartitionKey>(
        this.dynamoClient, this.helpers,
        { tableName: this.tableSchema.tableName },
      )
    }
    if (args.constructor === Array && args.length) {
      return new BatchGetChaining<Model, PartitionKey>(
        this.dynamoClient, this.helpers,
        { tableName: this.tableSchema.tableName, keys: args },
      )
    }
    if (args.constructor === Array && args.length === 0) {
      // can't call batch get without key
      throw new Error('BatchGetWithNoKeys')
    }
    return new GetChaining<Model, PartitionKey>(
      this.dynamoClient, this.helpers,
      { tableName: this.tableSchema.tableName, key: args })
  }

  // public save(item: Model): DynamoPut<Model>
  // public save(items: Model[]): DynamoBatchWrite<Model>
  //
  // public save(args: any) {
  //   if (args.constructor !== Array) {
  //     return new DynamoPut<Model>({
  //       schema: this._entitySchema,
  //       item: args,
  //     })
  //   }
  //   if (args.length) {
  //     return new DynamoBatchWrite<Model>({
  //       schema: this._entitySchema,
  //       items: args,
  //     })
  //   } else {
  //     throw new Error('BatchWriteWithNoItems')
  //   }
  // }
  //
  // public update(key: PartitionKey, item: ExplicitKeyItemType<Model, PartitionKey>):
  //   DynamoUpdate<Model, PartitionKey>
  //
  // public update(item: ImplicityKeyItemType<Model, PartitionKey>):
  //   DynamoUpdate<Model, PartitionKey>
  //
  // public update(...args: any[]) {
  //   if (args.length === 2) {
  //     return new DynamoUpdate({
  //       schema: this._entitySchema,
  //       key: args[0],
  //       item: args[1],
  //     } as any)
  //   } else {
  //     return new DynamoUpdate({
  //       schema: this._entitySchema,
  //       item: args[0],
  //     })
  //   }
  // }
  //
  // public delete(key: PartitionKey): DynamoDelete<Model, PartitionKey>
  // public delete(keys: PartitionKey[]): DynamoBatchDelete<PartitionKey>
  // public delete(args: any) {
  //   if (args.constructor !== Array) {
  //     return new DynamoDelete({
  //       schema: this._entitySchema,
  //       key: args,
  //     })
  //   } else {
  //     if (!args.length) {
  //       throw new Error('BatchDeleteWithNoKeys')
  //     }
  //     return new DynamoBatchDelete({
  //       schema: this._entitySchema,
  //       keys: args,
  //     })
  //   }
  // }
}
