import { DynamoDB } from 'aws-sdk'
import { Given } from 'cucumber'
import { typeDynamo } from '../utils/type-dynamo'

Given('a table {string} with partition key {string}',
  async (tableName, partitionKey) => {
    await typeDynamo.dynamoClient.createTable({
      TableName: tableName,
      KeySchema: [{AttributeName: partitionKey, KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: partitionKey, AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    }).promise()
  })

Given('a table {string} with partition key {string} and sort key {string}',
  async function(tableName, partitionKey, sortKey) {
    await typeDynamo.dynamoClient.createTable({
      TableName: tableName,
      KeySchema: [
        {AttributeName: partitionKey, KeyType: 'HASH'},
        {AttributeName: sortKey, KeyType: 'RANGE'},
      ],
      AttributeDefinitions: [
        {AttributeName: partitionKey, AttributeType: 'S'},
        {AttributeName: sortKey, AttributeType: 'S'},
      ],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    }, undefined).promise()
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

