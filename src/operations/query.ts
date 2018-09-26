import { DynamoDB } from 'aws-sdk'
import { AttributeMap, QueryInput } from 'aws-sdk/clients/dynamodb'
import { IHelpers, IQueryInput, IQueryResult } from '../types'
import DynamoClient from './dynamo-client'

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
    let dynamoQueryInput = this.buildDynamoQueryInput(input)

    let lastKey

    const result: IQueryResult<Model, KeySchema> = {
      data: [],
    }

    do {
      if (lastKey) {
        dynamoQueryInput = { ...dynamoQueryInput, ExclusiveStartKey: lastKey }
      }

      const {
        Items, LastEvaluatedKey,
      } = await this.dynamoClient.query(dynamoQueryInput)

      if (Items) {
        result.data = [...result.data, ...Items.map(this.toModel)]
      }

      if (LastEvaluatedKey) {
        lastKey = LastEvaluatedKey
        result.lastKey = this.parseLastKey(LastEvaluatedKey)
      } else {
        result.lastKey = undefined
      }
    } while (input.allResults && result.lastKey)

    return result
  }

  private parseLastKey(LastEvaluatedKey: DynamoDB.Key) {
    return DynamoDB.Converter.unmarshall(LastEvaluatedKey) as any
  }

  private buildDynamoQueryInput(
    input: IQueryInput<KeySchema, PartitionKey>,
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
      Limit: input.paginate && input.paginate.limit ?
        input.paginate.limit : this.DEFAULT_PAGINATION_ITEMS,
    }

    if (input.paginate && input.paginate.lastKey) {
      queryInput.ExclusiveStartKey = DynamoDB.Converter.marshall(
        input.paginate.lastKey as any,
      )
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
