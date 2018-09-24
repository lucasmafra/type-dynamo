import {
  ExpressionAttributeNamesGenerator,
  IExpressionAttributeNames,
} from './expression-attribute-names-generator'
import {
  ProjectionExpressionGenerator,
} from './projection-expression-generator'

export interface IWithAttributesExpression {
  projectionExpression: string,
  expressionAttributeNames: IExpressionAttributeNames
}

export class WithAttributesGenerator {
  private expressionAttributeNamesGenerator: ExpressionAttributeNamesGenerator
  private projectionExpressionGenerator: ProjectionExpressionGenerator

  public constructor(
    expressionAttributeNamesGenerator: ExpressionAttributeNamesGenerator,
    projectionExpressionGenerator: ProjectionExpressionGenerator,
  ) {
    this.expressionAttributeNamesGenerator = expressionAttributeNamesGenerator
    this.projectionExpressionGenerator = projectionExpressionGenerator
  }

  public generateExpression(attributes: string[]): IWithAttributesExpression {
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
