import { IProjectionExpressionGenerator } from '../types'

export class ProjectionExpressionGenerator
  implements IProjectionExpressionGenerator {
  public generateExpression(attributes: string[]) {
    const result = attributes.reduce((acc, currentValue) => {
      return acc + currentValue + ','
    }, '')
    return result.slice(0, result.length - 1)
  }
}
