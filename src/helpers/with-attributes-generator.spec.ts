import { WithAttributesGenerator } from './with-attributes-generator'

describe('WithAttributes', () => {
  const attributes = ['id', 'email', 'name']

  const expressionAttributeNamesGenerator = {
    generateExpression: jest.fn(() => ({
      '#id': 'id',
      '#name': 'name',
      '#email': 'email',
    })),
  }

  const projectionExpressionGenerator = {
    generateExpression: jest.fn(),
  }

  const withAttributesGenerator = new WithAttributesGenerator(
    expressionAttributeNamesGenerator as any,
    projectionExpressionGenerator as any,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('generates expression attribute names from attributes', () => {
    expect(withAttributesGenerator.generateExpression(attributes).expressionAttributeNames)
      .toEqual({
        '#id': 'id',
        '#email': 'email',
        '#name': 'name',
      })
  })

  it('calls projection expression generator with right attrs', () => {
    withAttributesGenerator.generateExpression(attributes)

    expect(projectionExpressionGenerator.generateExpression)
      .toHaveBeenCalledWith(['#id', '#name', '#email'])
  })
})
