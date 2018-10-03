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

Given('a table {string} with partition key {string} and sort key {string}' +
  ' and an index {string} on table {string} with partition key {string} ' +
  'and sort key {string}',
  async function(tableName, partitionKey, sortKey, indexName, _, indexPartitionKey, indexSortKey) {
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
      GlobalSecondaryIndexes: [{
        IndexName: indexName,
        Projection: { ProjectionType: 'KEYS_ONLY' },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        KeySchema: [{
          AttributeName: indexPartitionKey,
          KeyType: 'HASH',
        }, {
          AttributeName: indexSortKey,
          KeyType: 'RANGE',
        }],
      }],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    }, undefined).promise()
  })

Given('an index {string} on table {string} with partition key {string} ' +
  'and sort key {string}',
  async function(indexName, tableName, partitionKey, sortKey) {
    await typeDynamo.dynamoClient.updateTable({
      AttributeDefinitions: [{
        AttributeType: 'S',
        AttributeName: partitionKey,
      }, {
        AttributeType: 'S',
        AttributeName: sortKey,
      }],
      TableName: tableName,
      GlobalSecondaryIndexUpdates: [{
        Create: {
          IndexName: indexName,
          Projection: {ProjectionType: 'KEYS_ONLY'},
          KeySchema: [{
            AttributeName: partitionKey,
            KeyType: 'HASH',
          }, {
            AttributeName: sortKey,
            KeyType: 'RANGE',
          }],
          ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
        },
      }],
    }).promise()
  })
