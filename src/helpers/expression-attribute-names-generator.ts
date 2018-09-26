import { IExpressionAttributeNamesGenerator, IRandomGenerator } from '../types'

export class ExpressionAttributeNamesGenerator
  implements IExpressionAttributeNamesGenerator {
  private randomGenerator: IRandomGenerator

  public constructor(randomGenerator: IRandomGenerator) {
    this.randomGenerator = randomGenerator
  }

  public generateExpression(attrs: string[]) {
    return attrs.reduce((acc, value) => {
      const randomId = '#' + this.randomGenerator.generateRandomString()
      acc[randomId] = value
      return acc
    }, {})
  }
}
