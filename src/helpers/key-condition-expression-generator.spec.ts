import {
  KeyConditionExpressionGenerator,
} from './key-condition-expression-generator'

const expressionAttributeNamesGenerator = { generateExpression: jest.fn() }
describe('KeyConditionExpressionGenerator', () => {
  it('generates expression attribute names', () => {
    expressionAttributeNamesGenerator.generateExpression
      .mockImplementationOnce(() => ({
        '#id': 'id',
      }))

    const keyConditionExpressionGenerator = new KeyConditionExpressionGenerator(
      expressionAttributeNamesGenerator as any,
    )

    const keyConditionExpression = keyConditionExpressionGenerator
      .generateExpression({ id: '2' })

    expect(
      expressionAttributeNamesGenerator.generateExpression,
    ).toHaveBeenCalledWith(['id'])

    expect(
      keyConditionExpression.expressionAttributeNames,
    ).toEqual({ '#id': 'id' })
  })
})
