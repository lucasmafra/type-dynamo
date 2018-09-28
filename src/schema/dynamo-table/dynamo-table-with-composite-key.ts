import { BatchGetChaining } from '../../chaining/find/batch-get/batch-get'
import { GetChaining } from '../../chaining/find/get/get'
import { QueryChaining } from '../../chaining/find/query/query'
import { ScanChaining } from '../../chaining/find/scan/scan'
import DynamoClient from '../../operations/dynamo-client'
import { IHelpers, ITableSchema } from '../../types'

export class DynamoTableWithCompositeKey<Model, PartitionKey, SortKey> {
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

  public find(): ScanChaining<Model, PartitionKey & SortKey>

  public find(keys: Array<PartitionKey & SortKey>): BatchGetChaining<
    Model, PartitionKey & SortKey>

  public find(key: PartitionKey & SortKey): GetChaining<
    Model, PartitionKey & SortKey>

  public find(partitionKey: PartitionKey): QueryChaining<
    Model, PartitionKey, SortKey, PartitionKey & SortKey>

  public find(args?: any): any {
    if (!args) {
      return new ScanChaining<Model, PartitionKey & SortKey>(
        this.dynamoClient, this.helpers,
        { tableName: this.tableSchema.tableName },
      )
    }
    if (args.constructor === Array && args.length) {
      return new BatchGetChaining<Model, PartitionKey & SortKey>(
        this.dynamoClient, this.helpers,
        { tableName: this.tableSchema.tableName, keys: args  },
      )
    }

    if (args.constructor === Array && args.length === 0) {
      // can't call batch get without key
      throw new Error('BatchGetWithNoKeys')
    }

    if (Object.keys(args).length === 2) {
      return new GetChaining<Model, PartitionKey & SortKey>(
        this.dynamoClient, this.helpers,
        { tableName: this.tableSchema.tableName, key: args },
      )
    } else {
      return new QueryChaining<
        Model, PartitionKey, SortKey, PartitionKey & SortKey
        >(
          this.dynamoClient, this.helpers,
        { tableName: this.tableSchema.tableName, partitionKey: args },
      )
    }
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
  // public update(key: PartitionKey & SortKey, item: ExplicitKeyItemType<Model, PartitionKey & SortKey>):
  //   DynamoUpdate<Model, PartitionKey & SortKey>
  // public update(item: ImplicityKeyItemType<Model, PartitionKey & SortKey>):
  //   DynamoUpdate<Model, PartitionKey & SortKey>
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
  // public delete(key: PartitionKey & SortKey): DynamoDelete<Model, PartitionKey & SortKey>
  // public delete(keys: Array<PartitionKey & SortKey>): DynamoBatchDelete<PartitionKey & SortKey>
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
