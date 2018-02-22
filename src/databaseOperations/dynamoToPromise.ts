import * as AWS from 'aws-sdk'
import { DynamoDB } from 'aws-sdk'

class DynamoToPromise {

    constructor(private dynamo: DynamoDB.DocumentClient) { }

    public async scan(params: DynamoDB.ScanInput): Promise<DynamoDB.ScanOutput> {
        return new Promise((resolve, reject) => {
            this.dynamo.scan( params, (err: AWS.AWSError, data: DynamoDB.DocumentClient.ScanOutput) => {
                if (err) {
                    return reject(err)
                }
                return resolve(data)
            })
        })
    }

    public async getItem(params: DynamoDB.GetItemInput): Promise<DynamoDB.GetItemOutput> {
        return new Promise((resolve, reject) => {
            this.dynamo.get( params, (err: AWS.AWSError, data: DynamoDB.DocumentClient.GetItemOutput) => {
                if (err) {
                    return reject(err)
                }
                return resolve(data)
            })
        })
    }

    public async put(params: DynamoDB.PutItemInput): Promise<DynamoDB.PutItemOutput> {
        return new Promise((resolve, reject) => {
            this.dynamo.put( params, (err: AWS.AWSError, data: DynamoDB.DocumentClient.GetItemOutput) => {
                if (err) {
                    return reject(err)
                }
                return resolve(data)
            })
        })
    }

    public async update(params: DynamoDB.UpdateItemInput): Promise<DynamoDB.UpdateItemOutput> {
            return new Promise((resolve, reject) => {
            this.dynamo.update( params, (err: AWS.AWSError, data: DynamoDB.DocumentClient.UpdateItemOutput) => {
                if (err) {
                    return reject(err)
                }
                return resolve(data)
            })
        })
    }

    public async delete(params: DynamoDB.DeleteItemInput): Promise<DynamoDB.DeleteItemOutput> {
        return new Promise((resolve, reject) => {
            this.dynamo.delete( params, (err: AWS.AWSError, data: DynamoDB.DocumentClient.DeleteItemOutput) => {
                if (err) {
                    return reject(err)
                }
                return resolve(data)
            })
        })
    }
}

export default DynamoToPromise
