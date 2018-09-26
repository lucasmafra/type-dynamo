import { DynamoDB } from 'aws-sdk'
import DynamoClient from '../../operations/dynamo-client'
import { ICompositeSchema, ISdkOptions, ISimpleSchema } from '../../types'
import { DefineTableCompositeKey, DefineTableSimpleKey } from './define-table'

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

  public define<Model,
    PartitionKey extends keyof Model,
    SortKey extends keyof Model>(
    table: { new(): Model },
    schema: ICompositeSchema<PartitionKey, SortKey>,
  ): DefineTableCompositeKey<Model, PartitionKey, SortKey>

  public define<Table,
    PartitionKey extends keyof Table>(
    table: { new(): Table },
    schema: ISimpleSchema<PartitionKey>,
  ): DefineTableSimpleKey<Table, PartitionKey>

  public define(table: any, schema: any) {
    if (schema.sortKey !== undefined) {
      return new DefineTableCompositeKey(this.dynamoClient, schema)
    }
    return new DefineTableSimpleKey(this.dynamoClient, schema)
  }
}
