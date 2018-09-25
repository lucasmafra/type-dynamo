import { BeginsWith, IsBetween, IsEqualTo, IsGreaterOrEqualTo, IsGreaterThan,
  IsLessOrEqualTo, IsLessThan } from '../expressions/operator'
import {
  ExpressionAttributeNamesGenerator, IExpressionAttributeNames,
} from './expression-attribute-names-generator'
import {
  ExpressionAttributeValuesGenerator, IExpressionAttributeValues,
} from './expression-attribute-values-generator'

export type SortKeyConditionOperator = BeginsWith | IsEqualTo | IsGreaterThan |
  IsLessThan | IsLessOrEqualTo | IsGreaterOrEqualTo | IsBetween

export interface IWithSortKeyCondition {
  sortKeyName: string,
  sortKeyConditionOperator: SortKeyConditionOperator
}

export interface IKeyConditionExpression {
  keyConditionExpression: string,
  expressionAttributeNames: IExpressionAttributeNames,
  expressionAttributeValues: IExpressionAttributeValues,
}

export class KeyConditionExpressionGenerator {
  private expressionAttributeNamesGenerator: ExpressionAttributeNamesGenerator
  private expressionAttributeValuesGenerator: ExpressionAttributeValuesGenerator

  constructor(
    expressionAttributeNamesGenerator: ExpressionAttributeNamesGenerator,
    expressionAttributeValuesGenerator: ExpressionAttributeValuesGenerator,
  ) {
    this.expressionAttributeNamesGenerator = expressionAttributeNamesGenerator
    this.expressionAttributeValuesGenerator = expressionAttributeValuesGenerator
  }

  // TODO withSortKeyCondition
  public generateExpression(
    partitionKey: object, withSortKeyCondition?: IWithSortKeyCondition,
  ) {
    const keyName = this.getKeyNameFrom(partitionKey)
    const keyValue = this.getKeyValueFrom(partitionKey, keyName)

    const expressionAttributeNames = this.expressionAttributeNamesGenerator
        .generateExpression([keyName])

    const expressionAttributeValues = this.expressionAttributeValuesGenerator
        .generateExpression([keyValue])

    const keyConditionExpression = this.generateKeyConditionFrom(
      expressionAttributeNames, expressionAttributeValues,
    )

    return {
      expressionAttributeNames,
      expressionAttributeValues,
      keyConditionExpression,
    }
  }

  private getKeyNameFrom(partitionKey: object) {
    return Object.keys(partitionKey)[0]
  }

  private getKeyValueFrom(partitionKey: object, keyName: string) {
    return partitionKey[keyName]
  }

  private generateKeyConditionFrom(
    expressionAttributeNames: IExpressionAttributeNames,
    expressionAttributeValues: IExpressionAttributeValues,
  ) {
    const keyName = this.getKeyNameFrom(expressionAttributeNames)
    const keyValue = this.getKeyNameFrom(expressionAttributeValues)
    return `${keyName} = ${keyValue}`
  }
}
