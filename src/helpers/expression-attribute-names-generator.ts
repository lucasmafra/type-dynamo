import {
  RandomGenerator,
} from './random-generator'

export interface IExpressionAttributeNames { [key: string]: string }

export class ExpressionAttributeNamesGenerator {
  private randomGenerator: RandomGenerator

  public constructor(randomGenerator: RandomGenerator) {
    this.randomGenerator = randomGenerator
  }

  public generateExpression(attrs: string[]): IExpressionAttributeNames {
    return attrs.reduce((acc, value) => {
      const randomId = '#' + this.randomGenerator.generateRandomString()
      acc[randomId] = value
      return acc
    }, {})
  }
}
