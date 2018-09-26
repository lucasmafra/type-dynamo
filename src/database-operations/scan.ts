import { DynamoDB } from 'aws-sdk'
import { IHelpers } from '../helpers/index'
import DynamoClient from './dynamo-client'

export interface IScanPagination<KeySchema> {
  limit: number
  lastKey?: KeySchema
}

export interface IScanInput<KeySchema> {
  tableName: string
  indexName?: string
  withAttributes?: string[]
  pagination?: IScanPagination<KeySchema>
  allResults?: boolean
}

export interface IScanResult<Model, KeySchema> {
  data: Model[]
  lastKey?: KeySchema
}

export class Scan<Model, KeySchema> {
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
    input: IScanInput<KeySchema>,
  ): Promise<IScanResult<Model, KeySchema>> {
    let dynamoScanInput = this.buildDynamoScanInput(input)

    let lastKey

    const result: IScanResult<Model, KeySchema> = {
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
    input: IScanInput<KeySchema>,
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

    if (input.pagination) {
      dynamoScanInput.Limit = input.pagination.limit
      if (input.pagination.lastKey) {
        dynamoScanInput.ExclusiveStartKey = DynamoDB.Converter.marshall(
          input.pagination.lastKey as any,
        )
      }
    }

    return dynamoScanInput
  }

  private toModel(item: DynamoDB.AttributeMap): Model {
    return DynamoDB.Converter.unmarshall(item) as any
  }
}
