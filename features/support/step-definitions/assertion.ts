import { Then } from 'cucumber'
import * as expect from 'expect'
import { typeDynamo } from '../utils/type-dynamo'
import DynamoDB = require('../../../node_modules/aws-sdk/clients/dynamodb')
import arrayContaining = jasmine.arrayContaining

Then('I should get the following item:', function (dataTable) {
  const [item] = dataTable.hashes()
  expect(this.result).toEqual({data: item})
})

Then('I should get the following items in any order:', function (dataTable) {
  const items = dataTable.hashes()
  // @ts-ignore
  expect(this.result.data).toEqual(expect.arrayContaining(items))
  // @ts-ignore
  expect(items).toEqual(expect.arrayContaining(this.result.data))
})

Then('I should get the following items:', function (dataTable) {
  const items = dataTable.hashes()
  expect(this.result.data).toEqual(items)
})

Then('the table {string} should contain the following:',
  async (tableName, dataTable) => {
    const expected = dataTable.hashes()
    const {Items} = await typeDynamo.dynamoClient.scan({
      TableName: tableName,
    }).promise()
    const itemsInTable = (Items || []).map(
      (item) => DynamoDB.Converter.unmarshall(item))
    // @ts-ignore
    expect(itemsInTable).toEqual(expect.arrayContaining(expected))
  })
