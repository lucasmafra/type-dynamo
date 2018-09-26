import { IScanInput, Scan } from './scan'

interface IDummyModel {
  id: string
  email: string
}

interface IDummyKeySchema {
  id: string
}

const helpers = {
  withAttributesGenerator: {generateExpression: jest.fn()},
}

const dynamoClient = {
  scan: jest.fn(),
}

describe('Scan', () => {
  let input: IScanInput
  let scan: Scan<IDummyModel, IDummyKeySchema>

  beforeEach(() => {
    input = {
      tableName: 'DummyTable',
    }

    scan = new Scan(dynamoClient as any, helpers as any)

    jest.clearAllMocks()

    dynamoClient.scan.mockImplementationOnce(() => ({
      Items: [{
        id: {S: '1'},
        email: {S: 'fausto@gmail.com'},
      }, {
        id: {S: '2'},
        email: {S: 'silva@gmail.com'},
      }],
    }))
  })

  it('calls dynamoClient scan', async () => {
    await scan.execute(input)
    expect(dynamoClient.scan).toHaveBeenCalledWith({
      TableName: 'DummyTable',
    })
  })

  it('parses response from scan and returns it', async () => {
    expect(await scan.execute(input)).toEqual({
      data: [{
        id: '1', email: 'fausto@gmail.com',
      }, {
        id: '2', email: 'silva@gmail.com',
      }],
    })
  })

  // @ts-ignore
  context('when dynamoClient returns no items in response', async () => {
    beforeEach(() => {
      dynamoClient.scan.mockReset()
      dynamoClient.scan.mockImplementationOnce(() => ({Items: undefined}))
    })

    it('returns empty data', async () => {
      expect(await scan.execute(input)).toEqual({data: []})
    })
  })

  // @ts-ignore
  context('when indexName is present', () => {
    beforeEach(() => {
      input.indexName = 'dummyIndex'
    })

    it('calls dynamoClient scan upon index', async () => {
      await scan.execute(input)
      expect(dynamoClient.scan.mock.calls[0][0]).toMatchObject({
        IndexName: 'dummyIndex',
      })
    })
  })

  // @ts-ignore
  context('when withAttributes is present', () => {
    beforeEach(() => {
      input.withAttributes = ['email']
      helpers.withAttributesGenerator.generateExpression
        .mockImplementationOnce(() => ({
          expressionAttributeNames: {
            '#email': 'email',
          },
          projectionExpression: '#email',
        }))
    })

    it('calls dynamoClient with ExpressionAttributeNames', async () => {
      await scan.execute(input)

      expect(helpers.withAttributesGenerator.generateExpression)
        .toHaveBeenCalledWith(['email'])

      expect(dynamoClient.scan.mock.calls[0][0]).toMatchObject({
        ExpressionAttributeNames: { '#email': 'email' },
      })
    })

    it('calls dynamoClient with ProjectionExpression', async () => {
      await scan.execute(input)

      expect(dynamoClient.scan.mock.calls[0][0]).toMatchObject({
        ProjectionExpression: '#email',
      })
    })
  })
})
