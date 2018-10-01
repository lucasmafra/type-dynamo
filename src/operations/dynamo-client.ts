import { DynamoDB } from 'aws-sdk'
import { promisify } from 'util'

class DynamoClient {

  constructor(private dynamo: DynamoDB.DocumentClient) { }

  public async scan(params: DynamoDB.ScanInput): Promise<DynamoDB.ScanOutput> {
    return promisify(this.dynamo.scan)(params)
  }

  public async batchGet(
    params: DynamoDB.BatchGetItemInput,
  ): Promise<DynamoDB.BatchGetItemOutput> {
    return promisify(this.dynamo.batchGet)(params)
  }

  public async getItem(
    params: DynamoDB.GetItemInput,
  ): Promise<DynamoDB.GetItemOutput> {
    return promisify(this.dynamo.get)(params)
  }

  public async put(
    params: DynamoDB.PutItemInput,
  ): Promise<DynamoDB.PutItemOutput> {
    return promisify(this.dynamo.put)(params)
  }

  public async update(
    params: DynamoDB.UpdateItemInput,
  ): Promise<DynamoDB.UpdateItemOutput> {
    return promisify(this.dynamo.update)(params)
  }

  public async delete(
    params: DynamoDB.DeleteItemInput,
  ): Promise<DynamoDB.DeleteItemOutput> {
    return promisify(this.dynamo.delete)(params)
  }

  public async query(
    params: DynamoDB.QueryInput,
  ): Promise<DynamoDB.QueryOutput> {
    return promisify(this.dynamo.query)(params)
  }

  public async batchWrite(
    params: DynamoDB.BatchWriteItemInput,
  ): Promise<DynamoDB.BatchWriteItemOutput> {
    return promisify(this.dynamo.batchWrite)(params)
  }
}

export default DynamoClient
