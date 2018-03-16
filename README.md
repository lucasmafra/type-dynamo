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
import { typeDynamo } from './dynamo.config.ts'

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

### Querying data

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
  // use .allResults() carefully! It's not a good idea call it on a large table
  const result = await UserRepo.find().allResults().execute() // find() method also accepts no id as parameter
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

find(keys: Array<PartitionKey & SortKey>) // makes a Dynamo BatchGetItem behind the scenes

find(key: PartitionKey & SortKey) // makes a Dynamo GetItem behind the scenes

find(partitionKey: PartitionKey) // makes either a GetItem or Query, depending whether the schema has declared a sortKey.
```

This way, TypeDynamo will allways make the Dynamo request that best fits to your use case.

A great thing about *find* is that it comes with a built-in workaround for DynamoDB limitations in the result size for [BatchGetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html), [Scan](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) and [Query](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) methods, so you don't have to worry about that.

Also, *find()* method is strongly typed so if you try to pass invalid arguments TypeScript will complain about it. In our User example, all of these calls would cause a compiler error:

```ts
UserRepo.find({ id: false }).execute() // Compiler error, because user id is of type string and not boolean

UserRepo.find({id: '1'}).withAttributes(['lastName']).execute() // Compiler error bacause attribute 'lastName' does not belong to User

UserRepo.find({ id: '1', email: 'johndoe@email.com'}).execute() // Compiler error because 'email' does not belong to User partition key or sort key
```

If you want to know more about how to use *find()* method, checkout the [API Reference]().

### Writing new data

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

**Note**: By default, *save()* method has the same behavior of Dynamo SDK when writing an item, which means that it will overwrite an existing item unless you add a *.withCondition(attributeNotExists(TABLE_KEY))*. Also, remember that Dynamo does not allow you to add such condition when calling BatchWriteItem, which means that you're allways subject to overwriting items when calling a *save()* with multiple items.

### Updating data

For updating, use the *update()* method. A couple of examples:

* Updating a new user with two arguments
```ts
import { UserRepo, User } from './User'

async function updateUser(id: string, input: Partial<Pick<User, 'email' | 'name' | 'age' >>) { 
  const result = await UserRepo.update({ id }, input).execute() 
  const user = result.data
  console.log(user.id, user.name, user.email, user.age)
}
```

* Updating a new user with just one argument
```ts
import { UserRepo, User } from './User'

async function updateUser(input: Partial<User> && { id: string }) { 
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

If you notice well, when you call *update()* method providing two arguments, the second argument **must not** contain the item key. Otherwise, you would be trying to update an item key, which is not allowed by DynamoDB. On the other hand, if you decide to call *update()* method providing just one argument, it **must** contain the item key. Otherwise, DynamoDB can not know which item you're trying to udpate. But don't worry: all of this is really well typed in TypeDynamo, so you won't be able to make mistakes.

**Note**: TypeDynamo *update()* does not currently support batch update due to DynamoDB limitations.
  
### Deleting data

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