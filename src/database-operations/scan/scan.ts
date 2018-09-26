import { DynamoDB } from 'aws-sdk'
import { IHelpers } from '../../helpers'
import DynamoClient from '../dynamo-client'

// export async function scanPaginate<Entity, KeySchema>(
//   scanInput: DynamoDB.ScanInput, dynamoPromise: DynamoClient,
// ): Promise<ScanResult<Entity, KeySchema>> {
//   const scanOutput = await dynamoPromise.scan(scanInput)
//   const result: ScanResult<Entity, KeySchema> = {
//     data: scanOutput.Items as any,
//     lastKey: scanOutput.LastEvaluatedKey as any,
//   }
//   return result
// }
//
// export async function scanAllResults<Entity, KeySchema>(
//   scanInput: DynamoDB.ScanInput, dynamoPromise: DynamoClient,
// ): Promise<Omit<ScanResult<Entity, KeySchema>, 'lastKey'>> {
//   let lastKey
//   const result: ScanResult<Entity, KeySchema> = {} as any
//   do {
//     const scanOutput = await dynamoPromise.scan(scanInput)
//     if (!result.data) {
//       result.data = new Array<Entity>()
//     }
//     result.data = result.data.concat(scanOutput.Items as any)
//     lastKey = scanOutput.LastEvaluatedKey
//     if (lastKey) {
//       scanInput.ExclusiveStartKey = buildExclusiveStartKey(lastKey)
//     }
//   } while (lastKey)
//   return result
// }

export interface IScanInput {
  tableName: string
  indexName?: string
  withAttributes?: string[]
}

export interface IScanResult<Model, KeySchema> {
  data: Model[]
  lastKey?: KeySchema
}

export class Scan<Model, KeySchema> {
  private dynamoClient: DynamoClient
  private helpers: IHelpers

  public constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
  ) {
    this.dynamoClient = dynamoClient
    this.helpers = helpers
  }

  public async execute(
    input: IScanInput,
  ): Promise<IScanResult<Model, KeySchema>> {
    const dynamoScanInput = this.buildDynamoScanInput(input)

    const result: IScanResult<Model, KeySchema> = {
      data: [],
    }

    const { Items } = await this.dynamoClient.scan(dynamoScanInput)

    if (Items) {
      result.data = Items.map(this.toModel)
    }

    return result
  }

  private buildDynamoScanInput(input: IScanInput): DynamoDB.ScanInput {
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

    return dynamoScanInput
  }

  private toModel(item: DynamoDB.AttributeMap): Model {
    return DynamoDB.Converter.unmarshall(item) as any
  }
}
