import { DynamoDB } from 'aws-sdk'
import { AttributeValue } from 'aws-sdk/clients/dynamodb'
import {
  RandomGenerator,
} from './random-generator'

export interface IExpressionAttributeValues { [key: string]: AttributeValue }

export class ExpressionAttributeValuesGenerator {
  private randomGenerator: RandomGenerator

  public constructor(randomGenerator: RandomGenerator) {
    this.randomGenerator = randomGenerator
  }

  public generateExpression(values: any[]): IExpressionAttributeValues {
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
