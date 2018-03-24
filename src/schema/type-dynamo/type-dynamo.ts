import { DynamoDB } from 'aws-sdk'
import DynamoPromise from '../../database-operations/dynamo-to-promise'
import { IndexSchema, TableSchema } from '../../schema'
import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from '../../schema/dynamo-index'
import { DynamoORMWithCompositeKey, DynamoORMWithSimpleKey } from '../../schema/dynamo-orm'
import { DynamoTableWithCompositeKey, DynamoTableWithSimpleKey } from '../../schema/dynamo-table'
import { TypeDynamoDefineTableCompositeKey, TypeDynamoDefineTableSimpleKey } from './define-table'
const AmazonDaxClient = require('amazon-dax-client')

export interface SdkOptions {
    region: string
    accessKeyId?: string,
    secretAccessKey?: string,
    credentials?: AWS.Credentials
    credentialProvider?: AWS.CredentialProviderChain,
    apiVersion?: string,
    endpoint?: string,
    sslEnabled?: boolean,
    sessionToken?: string,
    maxRetries?: number,
    maxRedirects?: number,
    daxEndpoints?: string[]

}

export class TypeDynamo {
    private dynamoPromise: DynamoPromise
    constructor(sdkOptions: SdkOptions) {
        this.dynamoPromise = new DynamoPromise(new DynamoDB.DocumentClient({
            accessKeyId: sdkOptions.accessKeyId,
            secretAccessKey: sdkOptions.secretAccessKey,
            apiVersion: sdkOptions.apiVersion,
            credentials: sdkOptions.credentials,
            credentialProvider: sdkOptions.credentialProvider,
            endpoint: sdkOptions.endpoint,
            region: sdkOptions.region,
            sslEnabled: sdkOptions.sslEnabled,
            sessionToken: sdkOptions.sessionToken,
            maxRetries: sdkOptions.maxRetries,
            maxRedirects: sdkOptions.maxRedirects,
            service: sdkOptions.daxEndpoints &&
                AmazonDaxClient({endpoints: sdkOptions.daxEndpoints, region: sdkOptions.region}),
        }))
    }

    public defineTable<
        Table,
        PartitionKey extends keyof Table,
        SortKey extends keyof Table
    >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
            sortKey: SortKey,
        },
    ): TypeDynamoDefineTableCompositeKey<Table, PartitionKey, SortKey>

    public defineTable<
        Table,
        PartitionKey extends keyof Table
    >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
        },
    ): TypeDynamoDefineTableSimpleKey<Table, PartitionKey>

    public defineTable(table: any, schema: any) {
        if (schema.sortKey !== undefined) {
            return new TypeDynamoDefineTableCompositeKey(this.dynamoPromise, schema)
        }
        return new TypeDynamoDefineTableSimpleKey(this.dynamoPromise, schema)
    }

}
