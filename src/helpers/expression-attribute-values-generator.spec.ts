import {
  ExpressionAttributeValuesGenerator,
} from './expression-attribute-values-generator'

const randomGenerator = {
  generateRandomString: jest.fn(),
}

describe('ExpressionAttributeValuesGenerator', () => {
  it('generates an alias for each attribute passed using the random generator',
    () => {
      const attributes = [10, 'lucas', false]

      randomGenerator.generateRandomString
        .mockImplementationOnce(() => 'first')
        .mockImplementationOnce(() => 'second')
        .mockImplementationOnce(() => 'third')

      const expressionAttributeValuesGenerator =
        new ExpressionAttributeValuesGenerator(randomGenerator)

      expect(expressionAttributeValuesGenerator.generateExpression(attributes))
        .toEqual({
        ':first': { N: '10' },
        ':second': { S: 'lucas' },
        ':third': { BOOL: false },
      })
    })
})
