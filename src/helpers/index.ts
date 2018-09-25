import {
  ExpressionAttributeNamesGenerator,
} from './expression-attribute-names-generator'
import {
  ExpressionAttributeValuesGenerator,
} from './expression-attribute-values-generator'
import {
  KeyConditionExpressionGenerator,
} from './key-condition-expression-generator'
import {
  ProjectionExpressionGenerator,
} from './projection-expression-generator'
import { RandomGenerator } from './random-generator'
import { Timeout } from './timeout'
import { WithAttributesGenerator } from './with-attributes-generator'

export interface IHelpers {
  randomGenerator: RandomGenerator,
  expressionAttributeNamesGenerator: ExpressionAttributeNamesGenerator,
  expressionAttributeValuesGenerator: ExpressionAttributeValuesGenerator,
  projectionExpressionGenerator: ProjectionExpressionGenerator,
  withAttributesGenerator: WithAttributesGenerator,
  keyConditionExpressionGenerator: KeyConditionExpressionGenerator
  timeout: Timeout
}
