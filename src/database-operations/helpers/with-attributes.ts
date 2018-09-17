import { randomGenerator } from '../../expressions/random-generator'

export type IProjectionExpression = string
export interface IExpressionAttributeNames { [key: string]: string }
export interface IWithAttributesExpression {
  ProjectionExpression: IProjectionExpression,
  ExpressionAttributeNames: IExpressionAttributeNames
}

export class WithAttributes {
  public build(attrs: string[]): IWithAttributesExpression {
    const {
      attributes,
      ExpressionAttributeNames,
    } = this.expressionAttributeNames(attrs)
    const ProjectionExpression = this.projectionExpression(attributes)
    return { ExpressionAttributeNames, ProjectionExpression }
  }

  private expressionAttributeNames(attrs: string[]) {
    const attributes = new Array<string>()
    const ExpressionAttributeNames = attrs.reduce((acc, value) => {
      const randomId = '#' + randomGenerator()
      acc[randomId] = value
      attributes.push(randomId)
      return acc
    }, {})
    return { attributes, ExpressionAttributeNames }
  }

  private projectionExpression(attributes: string[]) {
      const result = attributes.reduce((acc, currentValue) => {
        return acc + currentValue + ','
      }, '')
      return result.slice(0, result.length - 1)
  }
}
