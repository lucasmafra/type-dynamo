import { DynamoDB } from 'aws-sdk'
import { IHelpers, IScanInput, IScanResult } from '../types'
import DynamoClient from './dynamo-client'

export class Scan {
  private dynamoClient: DynamoClient
  private helpers: IHelpers
  private DEFAULT_PAGINATION_ITEMS = 100

  public constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
  ) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
  }

  public async execute(
    input: IScanInput<any>,
  ): Promise<IScanResult<any, any>> {
    let dynamoScanInput = this.buildDynamoScanInput(input)

    let lastKey

    const result: IScanResult<any, any> = {
      data: [],
    }

    do {
      if (lastKey) {
        dynamoScanInput = { ...dynamoScanInput, ExclusiveStartKey: lastKey }
      }

      const {
        Items,
        LastEvaluatedKey,
      } = await this.dynamoClient.scan(dynamoScanInput)

      if (Items) {
        result.data = [...result.data, ...Items.map(this.toModel)]
      }

      if (LastEvaluatedKey) {
        lastKey = LastEvaluatedKey
        result.lastKey = DynamoDB.Converter.unmarshall(LastEvaluatedKey) as any
      } else {
        result.lastKey = undefined
      }

    } while (input.allResults && result.lastKey)

    return result
  }

  private buildDynamoScanInput(
    input: IScanInput<any>,
  ): DynamoDB.ScanInput {
    const dynamoScanInput: DynamoDB.ScanInput = {
      TableName: input.tableName,
    }

    if (input.indexName) {
      dynamoScanInput.IndexName = input.indexName
    }

    if (input.withAttributes) {
      const {
        expressionAttributeNames,
        projectionExpression,
      } = this.helpers.withAttributesGenerator
        .generateExpression(input.withAttributes)

      dynamoScanInput.ExpressionAttributeNames = expressionAttributeNames
      dynamoScanInput.ProjectionExpression = projectionExpression
    }

    dynamoScanInput.Limit = this.DEFAULT_PAGINATION_ITEMS

    if (input.paginate) {
      dynamoScanInput.Limit = input.paginate.limit
      if (input.paginate.lastKey) {
        dynamoScanInput.ExclusiveStartKey = DynamoDB.Converter.marshall(
          input.paginate.lastKey as any,
        )
      }
    }

    return dynamoScanInput
  }

  private toModel(item: DynamoDB.AttributeMap): any {
    return DynamoDB.Converter.unmarshall(item) as any
  }
}
