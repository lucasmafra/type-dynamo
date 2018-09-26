import {
  IExpressionAttributeNames,
  IExpressionAttributeNamesGenerator, IProjectionExpressionGenerator,
  IWithAttributesGenerator,
} from '../types'

export class WithAttributesGenerator implements  IWithAttributesGenerator {
  private expressionAttributeNamesGenerator: IExpressionAttributeNamesGenerator
  private projectionExpressionGenerator: IProjectionExpressionGenerator

  public constructor(
    expressionAttributeNamesGenerator: IExpressionAttributeNamesGenerator,
    projectionExpressionGenerator: IProjectionExpressionGenerator,
  ) {
    this.expressionAttributeNamesGenerator = expressionAttributeNamesGenerator
    this.projectionExpressionGenerator = projectionExpressionGenerator
  }

  public generateExpression(attributes: string[]) {
    const expressionAttributeNames = this.expressionAttributeNamesGenerator
      .generateExpression(attributes)

    const attributesAliases = this.getAliasesFrom(expressionAttributeNames)

    const projectionExpression = this.projectionExpressionGenerator
      .generateExpression(attributesAliases)

    return { expressionAttributeNames, projectionExpression }
  }

  private getAliasesFrom(expressionAttributeNames: IExpressionAttributeNames) {
    return Object.keys(expressionAttributeNames)
  }
}
