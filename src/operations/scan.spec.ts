import { IScanInput } from '../types'
import { Scan } from './scan'
import objectContaining = jasmine.objectContaining

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
  let input: IScanInput<IDummyKeySchema>
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
    expect(dynamoClient.scan.mock.calls[0][0]).toMatchObject({
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
        ExpressionAttributeNames: {'#email': 'email'},
      })
    })

    it('calls dynamoClient with ProjectionExpression', async () => {
      await scan.execute(input)

      expect(dynamoClient.scan.mock.calls[0][0]).toMatchObject({
        ProjectionExpression: '#email',
      })
    })

    it('paginates by default', async () => {
      await scan.execute(input)
      expect(dynamoClient.scan.mock.calls[0][0]).toMatchObject({
        Limit: 100,
      })
    })

    // @ts-ignore
    context('when dynamoClient returns LastEvaluatedKey', () => {
      beforeEach(() => {
        dynamoClient.scan.mockReset()

        dynamoClient.scan.mockImplementationOnce(() => ({
          LastEvaluatedKey: {id: {S: '1'}},
        }))
      })

      it('returns lastKey', async () => {
        expect(await scan.execute(input)).toMatchObject({
          lastKey: {id: '1'},
        })
      })
    })

    // @ts-ignore
    context('when paginate option is present', () => {
      beforeEach(() => {
        input.paginate = {limit: 50, lastKey: {id: '1'}}
      })

      it('overrides default paginate', async () => {
        await scan.execute(input)

        expect(dynamoClient.scan.mock.calls[0][0]).toMatchObject({
          Limit: 50,
          ExclusiveStartKey: {id: {S: '1'}},
        })
      })
    })

    // @ts-ignore
    context('when allResults option is present', () => {
      beforeEach(() => {
        input.allResults = true

        dynamoClient.scan.mockReset()

        dynamoClient.scan
          .mockImplementationOnce(() => ({
            Items: [{ id: { S: '1' }, email: { S: 'fausto@gmail.com' }}],
            LastEvaluatedKey: {id: {S: '1'}},
          }))
          .mockImplementationOnce(() => ({
            Items: [{ id: { S: '2' }, email: { S: 'silva@gmail.com' }}],
            LastEvaluatedKey: {id: {S: '2'}},
          }))
          .mockImplementationOnce(() => ({
            Items: [{ id: { S: '3' }, email: { S: 'faustao@hot.com' }}],
            LastEvaluatedKey: undefined,
          }))
      })

      it('calls dynamoClient until there is no item to retrieve', async () => {
        await scan.execute(input)
        expect(dynamoClient.scan).toHaveBeenCalledTimes(3)
      })

      it(`uses the LastEvaluatedKey from the previous call as the
      ExclusiveStartKey in the subsequent call`, async () => {
        await scan.execute(input)
        expect(dynamoClient.scan).toHaveBeenNthCalledWith(2, objectContaining({
          ExclusiveStartKey: { id: { S: '1' } },
        }))
        expect(dynamoClient.scan).toHaveBeenNthCalledWith(3, objectContaining( {
          ExclusiveStartKey: { id: { S: '2' } },
        }))
      })

      it('concats partial result from each call and return them', async () => {
        expect(await scan.execute(input)).toEqual({
          data: [{
            id: '1', email: 'fausto@gmail.com',
          }, {
            id: '2', email: 'silva@gmail.com',
          }, {
            id: '3', email: 'faustao@hot.com',
          }],
          lastKey: undefined,
        })
      })
    })
  })

  // @ts-ignore
  context('when filter is present', () => {
    it('calls dynamoClient with filter expression', () => {
      pending('not implemented yet')
    })
  })
})
