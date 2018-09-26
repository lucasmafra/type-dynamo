import { AttributeValue } from 'aws-sdk/clients/dynamodb'
import {
  BeginsWith, IsBetween,
  IsEqualTo, IsGreaterOrEqualTo,
  IsGreaterThan, IsLessOrEqualTo,
  IsLessThan,
} from '../expressions/operator'

export interface IExpressionAttributeNames { [key: string]: string }

export interface IExpressionAttributeValues { [key: string]: AttributeValue }

export type SortKeyConditionOperator = BeginsWith | IsEqualTo | IsGreaterThan |
  IsLessThan | IsLessOrEqualTo | IsGreaterOrEqualTo | IsBetween

export interface IWithSortKeyCondition {
  sortKeyName: string,
  sortKeyConditionOperator: SortKeyConditionOperator
}

export interface IKeyConditionExpression {
  keyConditionExpression: string,
  expressionAttributeNames: IExpressionAttributeNames,
  expressionAttributeValues: IExpressionAttributeValues,
}

export interface IWithAttributesExpression {
  projectionExpression: string,
  expressionAttributeNames: IExpressionAttributeNames
}

export interface IExpressionAttributeNamesGenerator {
  generateExpression(attrs: string[]): IExpressionAttributeNames
}

export interface IExpressionAttributeValuesGenerator {
  generateExpression(values: any[]): IExpressionAttributeValues
}

export interface IProjectionExpressionGenerator {
  generateExpression(attributes: string[]): string
}

export interface IWithAttributesGenerator {
  generateExpression(attributes: string[]): IWithAttributesExpression
}

export interface IRandomGenerator {
  generateRandomString(): string
}

export interface IKeyConditionExpressionGenerator {
  generateExpression(
    partitionKey: object, withSortKeyCondition?: IWithSortKeyCondition,
  ): IKeyConditionExpression
}

export interface ITimeout {
  wait(time: number): Promise<void>
}

export interface IHelpers {
  randomGenerator: IRandomGenerator,
  expressionAttributeNamesGenerator: IExpressionAttributeNamesGenerator,
  expressionAttributeValuesGenerator: IExpressionAttributeValuesGenerator,
  projectionExpressionGenerator: IProjectionExpressionGenerator,
  withAttributesGenerator: IWithAttributesGenerator,
  keyConditionExpressionGenerator: IKeyConditionExpressionGenerator
  timeout: ITimeout
}
