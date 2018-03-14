# TypeDynamo

TypeDynamo is an [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) for your Typescript projects running in Node.js environment. Its goal is to help you develop backend applications that uses [DynamoDB](https://aws.amazon.com/dynamodb) by abstracting most of the Dynamo boilerplate and letting you focus on what really matters: querying and writing your data!

TypeDynamo is completely agnostic to your server structure, so it supports both serverless and serverfull projects (see more in the examples section).

This library is inspired by other famous ORMs and ODMs, like Sequelize and Mongoose.

Some of TypeDynamo features:
  *  Easy declaration for your tables and indexes;
  *  Very simple CRUD methods with promise-like and chaining style;
  *  Type-safe database operations: all TypeDynamo methods have it's signature based on your table/index declaration, so you're allways type-safe;
  *  Pagination out of the box;
  *  Smart and intuitive expressions: never write complicated [expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) with attribute [names](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html) and [values](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeValues.html) again!

...and more!

## Table of Contents

 * [Installation](#getting-started-with-firebase)
 * [Defining your schema](#documentation)
 * [Querying data](#examples)
 * [Writing data](#examples)
 * [Running locally](#examples)
 * [API Reference](#migration-guides)
 * [Contributing](#contributing)


## Getting Started With Firebase

AngularFire requires [Firebase](https://firebase.google.com/) in order to authenticate users and sync
and store data. Firebase is a suite of integrated products designed to help you develop your app,
grow your user base, and earn money. You can [sign up here for a free account](https://console.firebase.google.com/).


## Downloading AngularFire

In order to use AngularFire in your project, you need to include the following files in your HTML:

```html
<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min.js"></script>

<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/3.6.6/firebase.js"></script>

<!-- AngularFire -->
<script src="https://cdn.firebase.com/libs/angularfire/2.3.0/angularfire.min.js"></script>
```

You can also install AngularFire via npm and Bower and its dependencies will be downloaded
automatically:

```bash
$ npm install angularfire --save
```

```bash
$ bower install angularfire --save
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