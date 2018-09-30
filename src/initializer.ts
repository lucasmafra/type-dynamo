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
import { BatchGet } from './operations/batch-get'
import DynamoClient from './operations/dynamo-client'
import { Get } from './operations/get'
import { Query } from './operations/query'
import { Scan } from './operations/scan'
import { IHelpers, IOperations, ISdkOptions } from './types'
const AmazonDaxClient = require('amazon-dax-client')

export class Initializer {
  public static initializeOperations(sdkOptions: ISdkOptions): IOperations {
    const dynamoClient = this.initializeDynamoClient(sdkOptions)
    const helpers = this.initializeHelpers()
    const operations: IOperations = {
      scan: new Scan(dynamoClient, helpers),
      query: new Query(dynamoClient, helpers),
      batchGet: new BatchGet(dynamoClient, helpers),
      get: new Get(dynamoClient, helpers),
    }
    return operations
  }

  private static initializeDynamoClient(sdkOptions: ISdkOptions) {
    return new DynamoClient(new DynamoDB.DocumentClient({
      ...sdkOptions as any,
      service: sdkOptions.daxEndpoints &&
        AmazonDaxClient({
          endpoints: sdkOptions.daxEndpoints,
          region: sdkOptions.region,
        }),
    }))
  }

  private static initializeHelpers(): IHelpers {
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
