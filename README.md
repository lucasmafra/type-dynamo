<div align="center">
  <img src="https://s3.amazonaws.com/type-dynamo-docs/logo.png" width="280" height="205">
  <br>
  <br>
</div>

#

TypeDynamo is an [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) for your Typescript projects running in Node.js environment. Its goal is to help you develop backend applications that uses [DynamoDB](https://aws.amazon.com/dynamodb) by abstracting most of the Dynamo boilerplate and letting you focus on what really matters: querying and writing your data!

TypeDynamo is completely agnostic to your server structure, so it supports both serverless and serverfull projects (see more in the [Demo]() section).

This library is heavily inspired by other famous ORMs and ODMs, like TypeORM, Sequelize and Mongoose.

Some of TypeDynamo features:
  *  Easy declaration for your tables and indexes;
  *  Very simple CRUD methods with promise-like and chaining style;
  *  Type-safe database operations: all TypeDynamo methods have it's signature based on your table/index declaration, so you're allways type-safe;
  *  Pagination out of the box;
  *  Expression resolvers: never write complicated [expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) with attribute [names](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html) and [values](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeValues.html) again!

...and more!

## Table of Contents

 * [Installation]()
 * [Getting started]()
    * [Dynamo setup]()
    * [Defining your schema]()
    * [Database operations]()
      * [Querying data]()
      * [Writing new data]()
      * [Updating data]()
      * [Deleting data]()
    * [Expressions]()
    * [Indexes]()
      * [Global Index]()
      * [Local Index]()
    * [Running locally]()
 * [Advanced Guide]()
 * [Demos]()
 * [API Reference]()
 * [Known Issues]()
 * [Contributing]()


## Instalation

### yarn
```sh
 yarn add type-dynamo
```

### npm
```sh
 npm install --save type-dynamo
```

## Getting started

### Dynamo setup

In order to use DynamoDB in your projects, you must have an AWS access key and secret key. If you don't have it, refer to this [link](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console).

Now, you just have to create a TypeDynamo instance by passing your configuration:

```ts
// dynamo.config.ts
import { TypeDynamo } from 'type-dynamo'
export const typeDynamo = new TypeDynamo({
  accessKeyId: '<YOUR_ACCESS_KEY_ID>',
  secretAccessKey: '<YOUR_SECRET_ACCESS_KEY>',
})
```
**Note**: It's a bad practice to put your keys hardcoded like that. In real projects you should set your keys as Node environment variables and access them in your code:

```ts
// dynamo.config.ts
import { TypeDynamo } from 'type-dynamo'
export const typeDynamo = new TypeDynamo({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
})
```

As an option, you could define your keys at *~/.aws/credentials* file. If you don't know how to do that, refer to this [link](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html). After that, you can instantiate TypeDynamo with no arguments:
```ts
// dynamo.config.ts
import { TypeDynamo } from 'type-dynamo'
export const typeDynamo = new TypeDynamo() // it will look for your credentials at ~/.aws/credentials
```

### Defining your Schema

In DynamoDB, you must allways declare an attribute as a *partition key* and optionally another attribute as a *sort key* for your Table. The choice of your key is very important since Dynamo will index your table based on the provided keys, which means that you'll be able to access your items immediately through this keys. For more information, checkout this [link](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html).

With that in mind, TypeDynamo makes your schema declaration very easy, since your table model is just a regular Typescript class. Let's say you have the following User class:

```ts
class User {
  id: string,
  name: string,
  email: string,
  age: number
}
```

All you have to do is call your typeDynamo instance *define* method, passing your table configuration:

```ts
// User.ts
import { typeDynamo } from './dynamo.config'

export class User {
  id: string,
  name: string,
  email: string,
  age: number
}

export const UserRepo = typeDynamo.define(User, {
  tableName: 'UserTable',
  partitionKey: 'id'
})
```

... and that's all! You're ready to start querying and writing data to Dynamo!

**Note**: DynamoDB requires the partitionKey and sortKey attributes to be of type **string** or **number**. So if you declare an boolean attribute as your partitionKey, for example, DynamoDB will throw an error at execution time. Although, TypeDynamo cannot prevent this error in compile time due to a TypeScript limitation.

### Database operations

TypeDynamo provides 4 high level functions to help you querying and writing data: *find()*, *save()*, *update()* and *delete()*. Let's dive into it!

#### Querying data

TypeDynamo makes easier to retrieve data from Dynamo by exposing *find()*, a high level function for reading the data. Let's see some examples based on the User schema declared in the early section:

* Getting a specific user by id
```ts
import { UserRepo } from './User'

async function getUserById(id: string) { 
  const result = await UserRepo.find({id}).execute() // pass the id as an object { "id": id }
  const user = result.data
  console.log(user.id, user.name, user.email, user.age) // you're type-safe
}
```

* Getting many specific users by ids
```ts
import { UserRepo } from './User'

async function getUsersByIds(ids: string[]) {
  const keys = ids.map(id => ({id})) // map each element to an object { "id" : id }
  const result = await UserRepo.find(keys).executue() // find() method accepts an array of ids
  result.data.map(user => {
    console.log(user.id, user.name, user.email, user.age)
  })
}
```

* Getting all users in the table
```ts
import { UserRepo } from './User'

async function getAllUsers() {
  // use .allResults() carefully! It's not a good idea to call it on a large table
  const result = await UserRepo.find().allResults().execute() // find() method accepts parameters
  result.data.map(user => {
    console.log(user.id, user.name, user.email, user.age)
  })
}
```

* Getting a paginated list of users with fewer attributes
```ts
import { UserRepo } from './User'

async function getUsersPreview() {
  const result = await UserRepo
                      .find()
                      .withAttributes(['id', 'name']) // request only 'id' and 'name' to Dynamo
                      .paginate(50) // gets the first 50 users encountered
                      .execute()

  result.data.map(userPreview => { // you are still type-safe
    // no problem with this call
    console.log(userPreview.id, userPreview.name) 

    // this causes a compiler error... awesome!
    console.log(userPreview.email, userPreview.age) 
  }))
}
```

* Getting a user list applying a filter expression
```ts
import { UserRepo } from './User'
import { match, isLessThan, contains } from 'type-dynamo/expressions'

async function getFilteredUsers(lastId?: string) {
  const result = await UserRepo
        .find()
        .filter( // getting just users with age less than 30 and email containing "@gmail.com"
          match('age', isLessThan(30))
          .and.
          match('email', contains('@gmail.com'))
        )
        .paginate(100, lastId? { id: lastId } : undefined) // if lastId is passed, it evaluates the items after the lastId encountered
        .execute()

  result.data.map(user => {
    console.log(user.id, user.name, user.email, user.age)
  })
  console.log(result.lastKey) // if it's undefined, there are no more items to evaluate in the table. Otherwise, it can be used for the next request
}
```

To support every use case of reading data from Dynamo, the *find()* method has 4 overload signatures:

```ts
find() // makes a Dynamo Scan request behind the scenes

find(keys: Array<Key>) // makes a Dynamo BatchGetItem behind the scenes

find(key: Key) // makes a Dynamo GetItem behind the scenes

find(partitionKey: PartitionKey) // makes either a GetItem or Query, depending whether the schema has declared a sortKey.
```

This way, TypeDynamo will allways make the Dynamo request that best fits to your use case.

**PS**: The Key type is actually a generic type depending on your schema declaration. In the provided User schema example, you would have `type PartitionKey = { id: string }` and `type Key = { id: string }` as well. Notice that since this table has only a partition key, TypeDynamo will never make a query request because it doesn't make sense: you can get any item with the partition key already. But if you have a schema declaration with a composite key like this:

```ts
// UserOrder.ts
import { typeDynamo } from './dynamo.config'

export class UserOrder {
  userId: string,
  orderId: string,
  createdAt: number // timestamp
}

export const UserOrderRepo = typeDynamo.define(User, {
  // this table has a composite key since it has both partition and sort key
  tableName: 'UserTable',
  partitionKey: 'userId',
  sortKey: 'orderId' 
})
```

...then you have `type PartitionKey = { userId: string }`, `type SortKey = { orderId: string }` and `type Key = { userId: string, orderId: string }`. This way, TypeDynamo can know that when you call *find*() like `UserOrderRepo.find({ userId: '1', orderId: 'abc'})` it must make a GetItem request, since you are getting a specific item from the table. But if you're calling *find()* like `UserOrderRepo.find({ userId: '1'})` you're actually making a query, because there could be more than one item in the table with this userId. So it will look for every item in the table with this userId and return the matched results.

A great thing about *find()* is that it comes with a built-in workaround for DynamoDB limitations in the result size for [BatchGetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html), [Scan](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) and [Query](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) methods, so you don't have to worry about that.

Also, *find()* method is strongly typed so if you try to pass invalid arguments TypeScript will complain about it. In our User example, all of these calls would cause a compiler error:

```ts
UserRepo.find({ id: false }).execute() // Compiler error, because user id is of type string and not boolean

UserRepo.find({id: '1'}).withAttributes(['lastName']).execute() // Compiler error bacause attribute 'lastName' does not belong to User

UserRepo.find({ id: '1', email: 'johndoe@email.com'}).execute() // Compiler error because 'email' does not belong to User Key
```

If you want to know more about how to use *find()* method, checkout the [API Reference]().

#### Writing new data

Many times you're going to need not only to query data from the database, but also write new data into it. TypeDynamo provides the high level *save*() method for that. Let's get into some examples with the User schema:

* Saving a new user
```ts
import { UserRepo, User } from './User'

async function saveUser(newUser: User) { 
  const result = await UserRepo.save(newUser).execute() // by default, TypeDynamo save() allways return the created item
  const user = result.data
  console.log(user.id, user.name, user.email, user.age)
}
```

* Saving many new users
```ts
import { UserRepo } from './User'

async function saveMultipleUsers(newUsers: User[]) {
  const result = await UserRepo.save(newUsers).executue() // save() method also accepts an array of items
  result.data.map(user => {
    console.log(user.id, user.name, user.email, user.age)
  })
}
```

* Writing a new user only if not already exists
```ts
import { UserRepo } from './User'

async function saveUser() {
  const result = await UserRepo
                      .save(User)
                      .withCondition(attributeNotExists('id'))
                      .execute() 
  result.data.map(user => {
    console.log(user.id, user.name, user.email, user.age)
  })
}
```

Like *find()*, the *save()* method has overload signature to support both single and batch write operations:

```ts
save(item: Item) // makes a Dynamo PutItem request behind the scenes

save(items: Item[]) // makes a Dynamo BatchWrite behind the scenes

```

It also handles Dynamo limitations for [BatchWrite]() out of the box, so you don't have to worry if you want to write more than 25 items at once, for example.

**Note**: By default, *save()* method has the same behavior of Dynamo SDK when writing an item, which means that it will overwrite any existing item unless you add a *.withCondition(attributeNotExists('TABLE_KEY'))* clause. Also, remember that Dynamo does not allow you to add such condition when calling BatchWriteItem, which means that you're allways subject to overwriting items when calling a *save()* with multiple items.

Find out more about *save()* in the [API Reference]().

#### Updating data

For updating, use the *update()* method. TypeDynamo allows you to call *update()* in two different ways. A couple of examples:

* Updating a new user with two arguments - the key and the update item
```ts
import { UserRepo, User } from './User'

async function updateUser(id: string, input: Partial<User>) { // the input contains the attributes you want to update
  // example: input = { email: 'newemail@gmail.com' }
  const result = await UserRepo.update({ id }, input).execute() // by default, *update()* return the updated item in case you need it
  const user = result.data
  console.log(user.id, user.name, user.email, user.age)
}
```

* Updating a new user with just one argument - the update item
```ts
import { UserRepo, User } from './User'

async function updateUser(input: Partial<User> && { id: string }) {  // in this case the input item must also contain the key
  // example: input = { id: '1', email: 'newemail@gmail.com' } 
  const result = await UserRepo.update({ id }, input).execute() 
  const user = result.data
  console.log(user.id, user.name, user.email, user.age)
}
```

* Updating a new user under a specific condition
```ts
import { UserRepo, User } from './User'
import { match, isGreaterThan } from 'type-dynamo/expressions'

async function updateUserWithCondition(input: Partial<User> && { id: string }) { 
  const result = await UserRepo
                      .update({ id }, input)
                      .withCondition(match('age', isGreaterThan(40))) // only updates if the corresponding item in the table has age greater than 40
                      .execute() 
  const user = result.data
  console.log(user.id, user.name, user.email, user.age)
}
```

If you notice well, when you call *update()* method with just one argument, the input **must** contain the item key along with the attributes you want to update. Otherwise, DynamoDB can not know which item you're trying to udpate. But don't worry: this is really well typed in TypeDynamo, so you won't be able to make any mistakes.

**Note**: TypeDynamo *update()* does not currently support batch update due to DynamoDB limitations.
  
Know more about *update()* in the [API Reference]().

#### Deleting data

TypeDynamo exposes the high level function *delete()* for deleting your items. Examples:

* Deleting a single user
```ts
import { UserRepo, User } from './User'

async function deleteUser(id: string) {
  const result = await UserRepo.delete({ id }).execute() // by default, delete() returns the deleted item in case you need it
  const user = result.data
  console.log(user.id, user.name, user.email, user.age)
}
```

* Deleting a single user under a specific condition
```ts
import { UserRepo, User } from './User'
import { match, isEqualTo } from 'type-dynamo/expressions'

async function deleteUserWithCondition(id: string) { 
  const result = await UserRepo
                      .delete({ id })
                      .withCondition(match('name', isEqualTo('John Doe')) // only updates if the corresponding item in the table has name equal to John Doe
                      .execute() 
  const user = result.data
  console.log(user.id, user.name, user.email, user.age)
}
```

* Deleting multiple users
```ts
import { UserRepo, User } from './User'

async function deleteUsers(ids: string[] }) {
  const keys = ids.map(id => ({id})) // map each array string element to the object { 'id': id }
  await UserRepo.delete(keys).execute() // this is a void method, it does not return the deleted items
}
```

To support both single and multiple delete operations, TypeDynamo *delete()* method has 2 signatures:

```ts
delete(key: Key) // makes a Dynamo DeleteItem request behind the scenes

delete(keys: Key[]) // makes a Dynamo BatchWriteItem behind the scenes (weird, but it's how DynamoDB works with batch delete)

```

Just like *find()* and *save()*, the *delete()* method has a workaround for DynamoDB limitations, so you don't have to worry
about deleting more items than DynamoDB actually supports.

**Note**: When deleting many items at once, TypeDynamo can't return the deleted items from the table, since DynamoDB doesn't support it. Also, DynamoDB only supports specifying conditions to single delete operations, so when you call TypeDynamo *delete()* method passing more than one item, you can't specify a delete condition.

Explore the [API Reference]() to know more about *delete()*.

### Expressions

### Indexes

#### Global Index

#### Local Index

### Running locally

## Advanced Guide

## Demos

* [Node.js + Serverless backend for a TODO app]()
* [Node.js + Express backend for a TODO app]()

## Known Issues

## Contributing

If you'd like to contribute to TypeDynamo, please first read through our [contribution
guidelines](). Local setup instructions are available [here]().