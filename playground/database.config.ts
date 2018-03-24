import { TypeDynamo } from '../src/schema/type-dynamo/type-dynamo'

export const typeDynamo = new TypeDynamo({
    // region: 'us-east-1',
    region: 'localhost',
    endpoint: 'http://localhost:8000',
})
