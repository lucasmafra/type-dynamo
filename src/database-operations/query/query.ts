import { DynamoDB } from 'aws-sdk'
import { AttributeMap, QueryInput } from 'aws-sdk/clients/dynamodb'
import { IHelpers } from '../../helpers'
import DynamoClient from '../dynamo-client'

export interface IQueryInput<KeySchema, PartitionKey> {
  tableName: string,
  indexName?: string,
  partitionKey: PartitionKey
  pagination?: IQueryPaginationOptions<KeySchema>
  allResults?: boolean
  withAttributes?: string[]
}

export interface IQueryResult<Model, KeySchema> {
  data: Model[]
  lastKey?: KeySchema
}

export interface IQueryPaginationOptions<KeySchema> {
  lastKey?: KeySchema,
  limit: number
}

export class Query<Model, KeySchema, PartitionKey> {
  private dynamoClient: DynamoClient
  private helpers: IHelpers

  private DEFAULT_PAGINATION_ITEMS = 100

  public constructor(dynamoClient: DynamoClient, helpers: IHelpers) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
  }

  public async execute(
    input: IQueryInput<KeySchema, PartitionKey>,
  ): Promise<IQueryResult<Model, KeySchema>> {
    const dynamoQueryInput = this.buildDynamoQueryInput(input)

    const {
      Items, LastEvaluatedKey,
    } = await this.dynamoClient.query(dynamoQueryInput)

    let lastKey

    const result: IQueryResult<Model, KeySchema> = {
      data: [],
    }

    if (Items) {
      result.data = Items.map(this.toModel)
    }

    if (LastEvaluatedKey) {
      lastKey = this.parseLastKey(LastEvaluatedKey)
      result.lastKey = lastKey
    }

    while (input.allResults === true && lastKey) {
      const nextDynamoQueryInput = this.buildDynamoQueryInput(input, lastKey)
      const nextResult = await this.dynamoClient.query(nextDynamoQueryInput)
      lastKey = nextResult.LastEvaluatedKey ?
        this.parseLastKey(nextResult.LastEvaluatedKey) :
        undefined

      if (nextResult.Items) {
        result.data = [...result.data, ...nextResult.Items.map(this.toModel)]
      }
      result.lastKey = lastKey
    }

    return result
  }

  private parseLastKey(LastEvaluatedKey: DynamoDB.Key) {
    return DynamoDB.Converter.unmarshall(LastEvaluatedKey) as any
  }

  private buildDynamoQueryInput(
    input: IQueryInput<KeySchema, PartitionKey>, lastKey?: KeySchema,
  ): DynamoDB.QueryInput {
    const {
      expressionAttributeValues: ExpressionAttributeValues,
      expressionAttributeNames: ExpressionAttributeNames,
      keyConditionExpression: KeyConditionExpression,
    } = this.helpers.keyConditionExpressionGenerator
      .generateExpression(input.partitionKey as any)

    const queryInput: QueryInput = {
      TableName: input.tableName,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
      KeyConditionExpression,
      Limit: input.pagination ?
        input.pagination.limit : this.DEFAULT_PAGINATION_ITEMS,
    }

    if (input.pagination && input.pagination.lastKey) {
      queryInput.ExclusiveStartKey = DynamoDB.Converter.marshall(
        input.pagination.lastKey as any,
      )
    }

    if (input.allResults && lastKey) {
      queryInput.ExclusiveStartKey = DynamoDB.Converter.marshall(lastKey as any)
    }

    if (input.indexName) {
      queryInput.IndexName = input.indexName
    }

    if (input.withAttributes) {
      const {
        expressionAttributeNames,
        projectionExpression,
      } = this.helpers.withAttributesGenerator
        .generateExpression(input.withAttributes)

      queryInput.ExpressionAttributeNames = {
        ...queryInput.ExpressionAttributeNames,
        ...expressionAttributeNames,
      }

      queryInput.ProjectionExpression = projectionExpression
    }
    return queryInput
  }

  private toModel(item: AttributeMap): Model {
    return DynamoDB.Converter.unmarshall(item) as any
  }
}
