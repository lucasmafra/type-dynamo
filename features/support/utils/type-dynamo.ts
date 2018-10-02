import { TypeDynamo } from '../../../src'

export const typeDynamo = new TypeDynamo({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION!,
  endpoint: process.env.ENDPOINT,
})
