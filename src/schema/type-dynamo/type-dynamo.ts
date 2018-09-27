import { DynamoDB } from 'aws-sdk'
import DynamoClient from '../../operations/dynamo-client'
import { ICompositeKeySchema, ISdkOptions, ISimpleKeySchema } from '../../types'
import { CompositeKey } from './define-table/composite-key/composite-key'
import { SimpleKey } from './define-table/simple-key/simple-key'

const AmazonDaxClient = require('amazon-dax-client')

export class TypeDynamo {
  private dynamoClient: DynamoClient

  constructor(sdkOptions: ISdkOptions) {
    this.dynamoClient = new DynamoClient(new DynamoDB.DocumentClient({
      ...sdkOptions as any,
      service: sdkOptions.daxEndpoints &&
        AmazonDaxClient({
          endpoints: sdkOptions.daxEndpoints,
          region: sdkOptions.region,
        }),
    }))
  }

  public define<Model, PartitionKey extends keyof Model,
    SortKey extends keyof Model>(
    table: { new(): Model }, schema: ICompositeKeySchema<PartitionKey, SortKey>,
  ): CompositeKey<Model, PartitionKey, SortKey>

  public define<Table, PartitionKey extends keyof Table>(
    table: { new(): Table }, schema: ISimpleKeySchema<PartitionKey>,
  ): SimpleKey<Table, PartitionKey>

  public define(table: any, schema: any) {
    if (schema.sortKey !== undefined) {
      return new CompositeKey(this.dynamoClient, schema)
    }
    return new SimpleKey(this.dynamoClient, schema)
  }
}
