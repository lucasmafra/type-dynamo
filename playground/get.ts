import { TypeDynamo } from '../src'

const typeDynamo = new TypeDynamo({
  region: 'us-east-1',
})

class User {
  public id: string
  public email: string
  public name: string
}

const UserRepo = typeDynamo.define(User, {
  partitionKey: 'id',
  tableName: 'UserTable',
})
  .withGlobalIndex({
    indexName: 'emailIndex',
    partitionKey: 'email',
    projectionType: 'ALL',
  })
  .withGlobalIndex({
    indexName: 'emailIndex2',
    partitionKey: 'email',
    projectionType: 'KEYS_ONLY',
  })
  .withGlobalIndex({
    indexName: 'emailIndex3',
    partitionKey: 'email',
    projectionType: 'INCLUDE',
    attributes: ['email', 'name'],
  })
  .getInstance()

class Feed {
  public userId: string
  public createdAt: number
  public content: string
}

const FeedRepo = typeDynamo.define(Feed, {
  tableName: 'FeedTable',
  partitionKey: 'userId',
  sortKey: 'createdAt',
}).getInstance()

const main = async () => {
  const { data: users } = await UserRepo.find().allResults().execute()
  users.map((user) => console.log(user.id, user.email, user.name))

  const { data: users2 } = await UserRepo.onIndex.emailIndex.find().allResults().execute()
  users2.map((user) => console.log(user.id, user.email, user.name))

  const { data: users3 } = await UserRepo.onIndex.emailIndex2.find().allResults().execute()
  users3.map((user) => console.log(user.id, user.email))

  const { data: users4 } = await UserRepo.onIndex.emailIndex3.find().allResults().execute()
  users4.map((user) => console.log(user.id, user.email, user.name))
}

const main2 = async () => {
  const { data: posts } = await FeedRepo.find().allResults().execute()
}
