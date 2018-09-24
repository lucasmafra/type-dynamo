import {
  ExpressionAttributeNamesGenerator, IExpressionAttributeNames,
} from './expression-attribute-names-generator'
import {
  IExpressionAttributeValues,
} from './expression-attribute-values-generator'

export interface IKeyConditionExpression {
  keyConditionExpression: string,
  expressionAttributeNames: IExpressionAttributeNames,
  expressionAttributeValues: IExpressionAttributeValues,
}

export class KeyConditionExpressionGenerator {
  private expressionAttributeNamesGenerator: ExpressionAttributeNamesGenerator

  constructor(
    expressionAttributeNamesGenerator: ExpressionAttributeNamesGenerator,
  ) {
    this.expressionAttributeNamesGenerator = expressionAttributeNamesGenerator
  }

  public generateExpression(partitionKey: object) {
    const keyName = this.getKeyNameFrom(partitionKey)
    return {
      expressionAttributeNames: this.expressionAttributeNamesGenerator.generateExpression([keyName]),
    }
  }

  private getKeyNameFrom(partitionKey: object) {
    return Object.keys(partitionKey)[0]
  }
}
