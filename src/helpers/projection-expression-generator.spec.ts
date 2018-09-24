import {
  ProjectionExpressionGenerator,
} from './projection-expression-generator'

describe('ProjectionExpressionGenerator', () => {
  it('generates projection expression from the given attributes', () => {
    const projectionExpressionGenerator = new ProjectionExpressionGenerator()

    const attributes = ['#id', '#name', '#email']

    expect(projectionExpressionGenerator.generateExpression(attributes))
      .toEqual('#id,#name,#email')
  })
})
