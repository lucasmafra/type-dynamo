# TypeDynamo

TypeDynamo is an [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) for your Typescript projects running in Node.js environment. Its goal is to help you develop backend applications that uses [DynamoDB](https://aws.amazon.com/dynamodb) by abstracting most of the Dynamo boilerplate and letting you focus on what really matters: querying and writing your data!

TypeDynamo is completely agnostic to your server structure, so it supports both serverless and serverfull projects (see more in the examples section).

This library is heavily inspired by other famous ORMs and ODMs, like Sequelize and Mongoose.

Some of TypeDynamo features:
  *  Easy declaration for your tables and indexes;
  *  Very simple CRUD methods with promise-like and chaining style;
  *  Type-safe database operations: all TypeDynamo methods have it's signature based on your table/index declaration, so you're allways type-safe;
  *  Pagination out of the box;
  *  Expression resolver: never write complicated [expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) with attribute [names](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html) and [values](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeValues.html) again!

...and more!

## Table of Contents

 * [Installation](#getting-started-with-firebase)
 * [Dynamo Setup](#getting-started-with-firebase)
 * [Defining your schema](#documentation)
 * [Querying data](#examples)
 * [Writing data](#examples)
 * [Running locally](#examples)
 * [API Reference](#migration-guides)
 * [Contributing](#contributing)


## Instalation

### yarn
```sh
 yarn add type-dynamo
```

### npm
```sh
 npm install --save type-dynamo
```

## Dynamo Setup


## Defining your Schema

In TypeDynamo, your tables are just regular Typescript classes. Let's say you have the following User class:

```ts
class User {
  id: string,
  name: string,
  email: string,
  age: number
}
```

You just have to import your typeDynamo instance and then export that User class using the *define* HOF (high order function):

```ts
// User.ts
import { typeDynamo } from './database.config.ts'

export class User {
  id: string,
  name: string,
  email: string,
  age: number
}

export default typeDynamo.define(User, {
  tableName: 'UserTable',
  partitionKey: 'id'
})
```

... and that's all! You're ready to start querying and writing to Dynamo! Let's see some examples:

```ts
// examples.ts

import { attributeNotExists } from 'type-dynamo'
import { default as UserRepo, User } from './User'

async function getUserById(id: string) { 
  return UserRepo.find({id}).execute()
}

async function getAllUsers() {
  const users = await UserRepo.find().allResults().execute()
  users.map(user => {
    // you are type-safe!
    console.log(user.id, user.name, user.email, user.age )
  })
}

async function getUsersPreview() {
  // gets 50 users per call with just their id and name, and TypeDynamo will
  // request only the desired attributes
  const usersPreview = await UserRepo
                      .find()
                      .withAttributes(['id', 'name'])
                      .paginate(50)
                      .execute()

  usersPreview.map(userPreview => { // you are still type-safe
    // no problem with this call
    console.log(userPreview.id, userPreview.name) 

    // this causes a compiler error
    console.log(userPreview.email, userPreview.age) 
  }))

  async function saveNewUser(user: User) {
    return UserRepo.save(user).execute()
  }

  async function updateUser(partialUser: Partial<User>) {
    return UserRepo.update(partialUser).execute()
  }
}

```
## Documentation

* [Quickstart](docs/quickstart.md)
* [Guide](docs/guide/README.md)
* [API Reference](docs/reference.md)


## Examples

### Full Examples

* [Wait And Eat](https://github.com/gordonmzhu/angular-course-demo-app-v2)
* [TodoMVC](https://github.com/tastejs/todomvc/tree/master/examples/firebase-angular)
* [Tic-Tac-Tic-Tac-Toe](https://github.com/jwngr/tic-tac-tic-tac-toe/)
* [Firereader](http://github.com/firebase/firereader)
* [Firepoker](https://github.com/Wizehive/Firepoker)

### Recipes

* [Date Object To A Firebase Timestamp Using `$extend`](http://jsfiddle.net/katowulf/syuzw9k1/)
* [Filter a `$FirebaseArray`](http://jsfiddle.net/firebase/ku8uL0pr/)


## Migration Guides

* [Migrating from AngularFire `1.x.x` to `2.x.x`](docs/migration/1XX-to-2XX.md)
* [Migrating from AngularFire `0.9.x` to `1.x.x`](docs/migration/09X-to-1XX.md)


## Contributing

If you'd like to contribute to AngularFire, please first read through our [contribution
guidelines](.github/CONTRIBUTING.md). Local setup instructions are available [here](.github/CONTRIBUTING.md#local-setup).