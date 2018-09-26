import {
  IExpressionAttributeNames,
  IExpressionAttributeNamesGenerator,
  IExpressionAttributeValues,
  IExpressionAttributeValuesGenerator, IKeyConditionExpressionGenerator,
  IWithSortKeyCondition,
} from '../types'
import {
  ExpressionAttributeNamesGenerator,
} from './expression-attribute-names-generator'

import {
  ExpressionAttributeValuesGenerator,
} from './expression-attribute-values-generator'

export class KeyConditionExpressionGenerator
  implements IKeyConditionExpressionGenerator {
  private expressionAttributeNamesGenerator: IExpressionAttributeNamesGenerator
  private expressionAttributeValuesGenerator: IExpressionAttributeValuesGenerator

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
