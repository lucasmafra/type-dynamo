import {
  KeyConditionExpressionGenerator,
} from './key-condition-expression-generator'

const expressionAttributeNamesGenerator = { generateExpression: jest.fn() }
const expressionAttributeValuesGenerator = { generateExpression: jest.fn() }
let keyConditionExpressionGenerator: KeyConditionExpressionGenerator

describe('KeyConditionExpressionGenerator', () => {
  beforeEach(() => {
    keyConditionExpressionGenerator = new KeyConditionExpressionGenerator(
      expressionAttributeNamesGenerator as any,
      expressionAttributeValuesGenerator as any,
    )

    expressionAttributeNamesGenerator.generateExpression
      .mockImplementationOnce(() => ({
        '#id': 'id',
      }))

    expressionAttributeValuesGenerator.generateExpression
      .mockImplementationOnce(() => ({
        ':value': { S: '2' },
      }))
  })

  it('generates expression attribute names', () => {
    const keyConditionExpression = keyConditionExpressionGenerator
      .generateExpression({ id: '2' })

    expect(
      expressionAttributeNamesGenerator.generateExpression,
    ).toHaveBeenCalledWith(['id'])

    expect(
      keyConditionExpression.expressionAttributeNames,
    ).toEqual({ '#id': 'id' })
  })

  it('generates expression attribute values', () => {
    const keyConditionExpression = keyConditionExpressionGenerator
      .generateExpression({ id: '2' })

    expect(
      expressionAttributeValuesGenerator.generateExpression,
    ).toHaveBeenCalledWith(['2'])

    expect(
      keyConditionExpression.expressionAttributeValues,
    ).toEqual({ ':value': { S: '2' } })
  })

  it('generates keyConditionExpression', () => {
    const { keyConditionExpression } = keyConditionExpressionGenerator
      .generateExpression({ id: '2' })

    expect(keyConditionExpression).toEqual('#id = :value')
  })

  // @ts-ignore
  context('when withSortKeyCondition is passed', () => {
    it('adds sort key to expression attribute names', () => {
      pending('not implemented yet')
    })

    it('adds the value to expression attribute values', () => {
      pending('not implemented yet')
    })

    it('adds the condition to key condition expression', () => {
      pending('not implemented yet')
    })
  })
})
