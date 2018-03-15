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
 * [Getting started](#getting-started-with-firebase)
    * [Dynamo Setup](#getting-started-with-firebase)
    * [Defining your schema](#documentation)
    * [Querying data](#examples)
    * [Writing data](#examples)
    * [Running locally](#examples)
 * [Advanced Guide]()
 * [Demos]()
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

## Getting started

### Dynamo Setup

In order to use DynamoDB in your projects, you must have an AWS access key and secret key. If you don't have it, refer to this [link](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console).

Now, you only have to create a TypeDynamo instance passing your configuration:

```ts
// dynamo.config.ts
import { TypeDynamo } from 'type-dynamo'
export const typeDynamo = new TypeDynamo({
  accessKeyId: '<YOUR_ACCESS_KEY_ID>',
  secretAccessKey: '<YOUR_SECRET_ACCESS_KEY>',
})
```
**OBS**: It's a bad practice to put your keys hardcoded like that. In real projects you should set your keys as Node environment variables and access them in your code:

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
import { typeDynamo } from './dynamo  .config.ts'

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

... and that's all! You're ready to start querying and writing to Dynamo!

### Querying data

TypeDynamo makes easier to retrieve data from Dynamo by providing a high level *find* method. Let's see some examples:

```ts
// examples.ts

import { attributeNotExists } from 'type-dynamo'
import UserRepo from './User' // our exported schema

async function getUserById(id: string) { 
  return UserRepo.find({id}).execute()
}

async function getUsersByIds(ids: string[]) {
  const keys = ids.map(id => ({id})) // map each element to an object {id}
  return UserRepo.find(keys).executue()
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
  
}
```

Everytime you need to retrieve data from Dynamo,

### Writing data

### Running locally

## Advanced Guide
## Demos

* [Node.js + Serverless backend for a TODO app](https://github.com/gordonmzhu/angular-course-demo-app-v2)
* [Node.js + Express backend for a TODO app](https://github.com/tastejs/todomvc/tree/master/examples/firebase-angular)

## Contributing

If you'd like to contribute to TypeDynamo, please first read through our [contribution
guidelines](.github/CONTRIBUTING.md). Local setup instructions are available [here](.github/CONTRIBUTING.md#local-setup).