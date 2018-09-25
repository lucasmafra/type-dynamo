import { IQueryInput, Query } from './query'

interface IFeedModel {
  userId: string
  createdAt: number
  content: string
}

interface IFeedKeySchema {
  userId: string
  createdAt: number
}

interface IFeedPartitionKey {
  userId: string
}

const dynamoClient = {
  query: jest.fn(),
}

const helpers = {
  keyConditionExpressionGenerator: {generateExpression: jest.fn()},
}

describe('Query', () => {
  const input: IQueryInput<IFeedKeySchema, IFeedPartitionKey> = {
    tableName: 'FeedTable',
    partitionKey: {userId: '1'},
  }
  let query: Query<IFeedModel, IFeedKeySchema, IFeedPartitionKey>

  beforeEach(() => {
    query = new Query<IFeedModel, IFeedKeySchema, IFeedPartitionKey>(
      dynamoClient as any,
      helpers as any,
    )

    jest.resetAllMocks()

    helpers.keyConditionExpressionGenerator.generateExpression
      .mockImplementation(() => ({
        keyConditionExpression: '#userId = :userIdValue',
        expressionAttributeNames: {'#userId': 'userId'},
        expressionAttributeValues: {':userIdValue': {S: '1'}},
      }))

    dynamoClient.query.mockImplementationOnce(() => ({
      Items: [{
        userId: {S: '1'},
        createdAt: {N: '1234'},
        email: {S: 'john@doe.com'},
      }],
    }))
  })

  it('calls dynamoClient query correctly', async () => {
    await query.execute(input)

    expect(helpers.keyConditionExpressionGenerator.generateExpression)
      .toHaveBeenCalledWith({userId: '1'})

    expect(dynamoClient.query.mock.calls[0][0]).toMatchObject({
      TableName: 'FeedTable',
      KeyConditionExpression: '#userId = :userIdValue',
      ExpressionAttributeNames: {
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':userIdValue': {S: '1'},
      },
    })
  })

  it('parses result and returns it', async () => {
    expect(await query.execute(input)).toEqual({
      data: [{userId: '1', createdAt: 1234, email: 'john@doe.com'}],
    })
  })

  context('when dynamoClient returns no item', () => {
    beforeEach(() => {
      dynamoClient.query.mockReset()
      dynamoClient.query.mockImplementationOnce(() => ({Items: undefined}))
    })

    it('returns an empty array', async () => {
      expect(await query.execute(input)).toEqual({data: []})
    })
  })

  context('when dynamoClient returns LastEvaluatedKey', () => {
    beforeEach(() => {
      dynamoClient.query.mockReset()
      dynamoClient.query.mockImplementationOnce(() => ({
        LastEvaluatedKey: {
          userId: {S: '1'},
          createdAt: {N: '1234'},
        },
      }))
    })

    it('returns lastKey', async () => {
      const {lastKey} = await query.execute(input)
      expect(lastKey).toEqual({userId: '1', createdAt: 1234})
    })
  })

  it('paginates by default', async () => {
    await query.execute(input)
    expect(dynamoClient.query.mock.calls[0][0]).toMatchObject({
      Limit: 100,
    })
  })

  context('when pagination options are passed', () => {
    beforeEach(() => {
      input.pagination = {
        limit: 50,
        lastKey: {userId: '1', createdAt: 1234},
      }
    })

    it('overrides default pagination', async () => {
      await query.execute(input)
      expect(dynamoClient.query.mock.calls[0][0]).toMatchObject({
        Limit: 50,
        ExclusiveStartKey: {userId: {S: '1'}, createdAt: {N: '1234'}},
      })
    })
  })

  context('when allResults is set to true', () => {
    beforeEach(() => {
      input.allResults = true

      dynamoClient.query.mockReset()

      dynamoClient.query
        .mockImplementationOnce(() => ({
          LastEvaluatedKey: {userId: {S: '1'}, createdAt: {N: '1'}},
        }))
        .mockImplementationOnce(() => ({
          LastEvaluatedKey: {userId: {S: '1'}, createdAt: {N: '2'}},
        }))
        .mockImplementationOnce(() => ({}))
    })

    it('calls queries while LastEvaluatedKey is present', async () => {
      await query.execute(input)
      expect(dynamoClient.query).toHaveBeenCalledTimes(3)
    })
  })

  context('when index name is passed', () => {
    beforeEach(() => {
      dynamoClient.query.mockClear()
      input.indexName = 'createdAtIndex'
    })

    it('calls dynamoClient with the index option', async () => {
      await query.execute(input)
      expect(dynamoClient.query.mock.calls[0][0]).toMatchObject({
        IndexName: 'createdAtIndex',
      })
    })
  })
})
