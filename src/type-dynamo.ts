import { DynamoDB } from 'aws-sdk'
import {
  ExpressionAttributeNamesGenerator,
} from './helpers/expression-attribute-names-generator'
import {
  ExpressionAttributeValuesGenerator,
} from './helpers/expression-attribute-values-generator'
import {
  KeyConditionExpressionGenerator,
} from './helpers/key-condition-expression-generator'
import {
  ProjectionExpressionGenerator,
} from './helpers/projection-expression-generator'
import {
  RandomGenerator,
} from './helpers/random-generator'
import {
  Timeout,
} from './helpers/timeout'
import {
  WithAttributesGenerator,
} from './helpers/with-attributes-generator'
import DynamoClient from './operations/dynamo-client'
import {
  DefineTableWithCompositeKey,
} from './schema/define-table/define-table-with-composite-key'
import {
  DefineTableWithSimpleKey,
} from './schema/define-table/define-table-with-simple-key'
import {
  ICompositeKeySchema, IHelpers, ISdkOptions, ISimpleKeySchema,
} from './types/index'

const AmazonDaxClient = require('amazon-dax-client')

export class TypeDynamo {
  private dynamoClient: DynamoClient
  private helpers: IHelpers

  constructor(sdkOptions: ISdkOptions) {
    this.dynamoClient = this.initializeDynamoClient(sdkOptions)
    this.helpers = this.initializeHelpers()
  }

  public define<Model, PartitionKey extends keyof Model>(
    table: { new(): Model }, schema: ISimpleKeySchema<PartitionKey>,
  ): DefineTableWithSimpleKey<Model, PartitionKey>

  public define<Model, PartitionKey extends keyof Model,
    SortKey extends keyof Model>(
    table: { new(): Model }, schema: ICompositeKeySchema<PartitionKey, SortKey>,
  ): DefineTableWithCompositeKey<Model, PartitionKey, SortKey>

  public define(table: any, schema: any) {
    if (schema.sortKey) {
      return new DefineTableWithCompositeKey(
        this.dynamoClient, this.helpers, schema,
      )
    } else {
      return new DefineTableWithSimpleKey(
        this.dynamoClient, this.helpers, schema,
      )
    }
  }

  private initializeDynamoClient(sdkOptions: ISdkOptions) {
    return new DynamoClient(new DynamoDB.DocumentClient({
      ...sdkOptions as any,
      service: sdkOptions.daxEndpoints &&
        AmazonDaxClient({
          endpoints: sdkOptions.daxEndpoints,
          region: sdkOptions.region,
        }),
    }))
  }

  private initializeHelpers(): IHelpers {
    const randomGenerator = new RandomGenerator()

    const expressionAttributeNamesGenerator =
      new ExpressionAttributeNamesGenerator(randomGenerator)

    const expressionAttributeValuesGenerator =
      new ExpressionAttributeValuesGenerator(randomGenerator)

    const projectionExpressionGenerator = new ProjectionExpressionGenerator()

    const timeout = new Timeout()

    const withAttributesGenerator = new WithAttributesGenerator(
      expressionAttributeNamesGenerator, projectionExpressionGenerator,
    )

    const keyConditionExpressionGenerator = new KeyConditionExpressionGenerator(
      expressionAttributeNamesGenerator, expressionAttributeValuesGenerator,
    )

    return {
      randomGenerator, projectionExpressionGenerator, timeout,
      expressionAttributeNamesGenerator, expressionAttributeValuesGenerator,
      withAttributesGenerator, keyConditionExpressionGenerator,
    }
  }
}
