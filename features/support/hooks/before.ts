import { Before } from 'cucumber'
import { typeDynamo } from '../utils/type-dynamo'

Before(async () => {
  const tables = await typeDynamo.dynamoClient.listTables().promise()
  if (!tables.TableNames) { return }
  const promises = tables.TableNames.map(
    (table) => typeDynamo.dynamoClient
      .deleteTable({ TableName: table }).promise(),
  )
  await Promise.all(promises)
})
