import { DynamoDB } from 'aws-sdk'
import { IExpressionAttributeValuesGenerator, IRandomGenerator } from '../types'

export class ExpressionAttributeValuesGenerator
  implements  IExpressionAttributeValuesGenerator {
  private randomGenerator: IRandomGenerator

  public constructor(randomGenerator: IRandomGenerator) {
    this.randomGenerator = randomGenerator
  }

  public generateExpression(values: any[]) {
    return values.reduce((acc, value) => {
      const randomId = ':' + this.randomGenerator.generateRandomString()
      return Object.assign(
        {} ,
        acc,
        DynamoDB.Converter.marshall({ [randomId]: value }),
      )
    }, {})
  }
}
