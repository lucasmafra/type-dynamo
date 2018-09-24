import {
  ExpressionAttributeNamesGenerator,
} from './expression-attribute-names-generator'

const randomGenerator = {
  generateRandomString: jest.fn(),
}

describe('ExpressionAttributeNamesGenerator', () => {
  it('generates an alias for each attribute passed using the random generator',
    () => {
    const attributes = ['id', 'email', 'name']

    randomGenerator.generateRandomString
      .mockImplementationOnce(() => 'i')
      .mockImplementationOnce(() => 'e')
      .mockImplementationOnce(() => 'n')

    const expressionAttributeNamesGenerator =
      new ExpressionAttributeNamesGenerator(randomGenerator)

    expect(expressionAttributeNamesGenerator.generateExpression(attributes))
      .toEqual({
      '#i': 'id',
      '#e': 'email',
      '#n': 'name',
    })
  })
})
