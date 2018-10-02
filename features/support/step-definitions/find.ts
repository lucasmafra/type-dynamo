import { DynamoDB } from 'aws-sdk'
import { Given, Then, When } from 'cucumber'
import * as expect from 'expect'
import { orderBy } from 'lodash'
import { typeDynamo } from '../utils/type-dynamo'
import { User } from '../utils/User'

Given('a table {string} with partition key {string}',
  async (tableName, partitionKey) => {
    await typeDynamo.dynamoClient.createTable({
      TableName: tableName,
      KeySchema: [{AttributeName: partitionKey, KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: partitionKey, AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    }).promise()
  })

Given('the following items are saved on table {string}:',
  async function(tableName, dataTable) {
    const items = dataTable.hashes().map((item: any) => ({
      PutRequest: {Item: DynamoDB.Converter.marshall(item)},
    }))
    await typeDynamo.dynamoClient.batchWriteItem({
      RequestItems: {
        [tableName]: items,
      },
    }).promise()
  })

When(/I call User\.find\({ id: (1) }\)\.execute\(\)/, async function(id) {
  this.set(
    await User.find({id}).execute(),
  )
})

Then('I should get the following item:', function(dataTable) {
  const [item] = dataTable.hashes()
  expect(this.result).toEqual({data: item})
})

When(/I call User\.find\(ids\)\.execute\(\) with the following ids:/,
  async function(dataTable) {
    const ids = dataTable.hashes() as Array<{ id: string }>
    this.set(
      await User.find(ids).execute(),
    )
  })

Then('I should get the following items in any order:', function(dataTable) {
  const items = dataTable.hashes()
  expect(orderBy(this.result.data, 'id')).toEqual(orderBy(items, 'id'))
})

When(/I call User\.find\(\)\.allResults\(\)\.execute\(\)/,
  async function() {
    this.set(
      await User.find().allResults().execute(),
    )
  })
