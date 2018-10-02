import { TypeDynamo } from '../../../src'

export const typeDynamo = new TypeDynamo({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.secret_access_key,
  region: 'localhost',
  endpoint: 'http://localhost:8000',
})
