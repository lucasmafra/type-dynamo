import { IQueryInput, Query } from './query'

interface IFeedModel { userId: string, createdAt: number, content: string }
interface IFeedPartitionKey { userId: string }

const dynamoClient = {
  query: jest.fn(),
}

describe('Query', () => {
  const input: IQueryInput<IFeedPartitionKey> = {
    tableName: 'FeedTable',
    partitionKey: { userId: '1' },
  }

  it('calls dynamoClient query correctly', async () => {
    const query = new Query<IFeedModel, IFeedPartitionKey>(dynamoClient as any)
    await query.execute(input)
    expect(dynamoClient.query).toHaveBeenCalledWith({
      TableName: 'FeedTable',
      KeyConditionExpression: '#userId = :userIdValue',
      ExpressionAttributeNames: {
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':userIdValue': { S: '1' },
      },
    })
  })
})
