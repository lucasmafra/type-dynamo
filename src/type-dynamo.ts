import { DynamoDB } from 'aws-sdk'
import DynamoPromise from './database-operations/dynamo-to-promise'
import { IndexSchema, TableSchema } from './schema'
import { DynamoIndexWithCompositeKey, DynamoIndexWithSimpleKey } from './schema/dynamo-index'
import { DynamoORMWithCompositeKey, DynamoORMWithSimpleKey } from './schema/dynamo-orm'
import { DynamoTableWithCompositeKey, DynamoTableWithSimpleKey } from './schema/dynamo-table'
const AmazonDaxClient = require('amazon-dax-client');

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

    public define< // partitionKey; no index
        Table,
        PartitionKey extends keyof Table
    >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
        },
    ): DynamoTableWithSimpleKey<
        Table,
        Pick<Table, PartitionKey>
    >

    public define< // partitionKey and sortKey; no index
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
        ): DynamoTableWithCompositeKey<
        Table,
        Pick<Table, PartitionKey>,
        Pick<Table, SortKey>
    >

    public define< // partitionKey; globalIndexes
        Table,
        PartitionKey extends keyof Table,
        GlobalIndexes
    >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
            globalIndexes: GlobalIndexes,
        },
    ): DynamoORMWithSimpleKey<
        Table,
        Pick<Table, PartitionKey>,
        GlobalIndexes,
        undefined
    >

    public define< // partitionKey and sortKey; globalIndexes
        Table,
        PartitionKey extends keyof Table,
        SortKey extends keyof Table,
        GlobalIndexes
        >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
            sortKey: SortKey,
            globalIndexes: GlobalIndexes,
        },
        ): DynamoORMWithCompositeKey<
        Table,
        Pick<Table, PartitionKey>,
        Pick<Table, SortKey>,
        GlobalIndexes,
        undefined
    >

    public define< // partitionKey; localIndexes
        Table,
        PartitionKey extends keyof Table,
        LocalIndexes
        >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
            localIndexes: LocalIndexes,
        },
    ): DynamoORMWithSimpleKey<
        Table,
        Pick<Table, PartitionKey>,
        undefined,
        LocalIndexes
    >

    public define< // partitionKey and sortKey; localIndexes
        Table,
        PartitionKey extends keyof Table,
        SortKey extends keyof Table,
        LocalIndexes
        >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
            sortKey: PartitionKey,
            localIndexes: LocalIndexes,
        },
        ): DynamoORMWithCompositeKey<
        Table,
        Pick<Table, PartitionKey>,
        Pick<Table, SortKey>,
        undefined,
        LocalIndexes
    >

    public define< // partitionKey; globalIndex and localIndex
        Table,
        PartitionKey extends keyof Table,
        GlobalIndexes,
        LocalIndexes
        >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
            globalIndexes: GlobalIndexes,
            localIndexes: LocalIndexes,
        },
        ): DynamoORMWithSimpleKey<
        Table,
        Pick<Table, PartitionKey>,
        GlobalIndexes,
        LocalIndexes
    >

    public define< // partitionKey and sortKey; globalIndex and localIndex
        Table,
        PartitionKey extends keyof Table,
        SortKey extends keyof Table,
        GlobalIndexes,
        LocalIndexes
        >(
        table: {new(): Table },
        schema: {
            tableName: string,
            partitionKey: PartitionKey,
            sortKey: SortKey,
            globalIndexes: GlobalIndexes,
            localIndexes: LocalIndexes,
        },
        ): DynamoORMWithCompositeKey<
        Table,
        Pick<Table, PartitionKey>,
        Pick<Table, SortKey>,
        GlobalIndexes,
        LocalIndexes
    >

    public define(constructor: any, schema: any) {
        const tableSchema = this.buildTableSchema(schema)
        if (schema.globalIndexes || schema.localIndexes) {
            if (tableSchema.sortKey) {
                return new DynamoORMWithCompositeKey(
                    tableSchema, schema.globalIndexes, schema.localIndexes, this.dynamoPromise,
                )
            }
            return new DynamoORMWithSimpleKey(
                tableSchema, schema.globalIndexes, schema.localIndexes, this.dynamoPromise,
            )
        }
        if (tableSchema.sortKey) {
            return new DynamoTableWithCompositeKey(
                tableSchema, this.dynamoPromise,
            )
        }
        return new DynamoTableWithSimpleKey(
            tableSchema, this.dynamoPromise,
        )
    }

    private buildTableSchema(schema: any): TableSchema {
        const tableSchema: TableSchema = {
            tableName: schema.tableName,
            partitionKey: schema.partitionKey,
            sortKey: schema.sortKey,
            writeCapacity: schema.writeCapacity || 1,
            readCapacity: schema.readCapacity || 1,
        }
        return tableSchema
    }

}
