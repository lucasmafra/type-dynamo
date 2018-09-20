import { TypeDynamo } from '../src/schema/type-dynamo'

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
}).getInstance()

const main = async () => {
  const { data: user } = await UserRepo.find({ id: '1' }).execute()
  console.log(user.id, user.email, user.name)
}
