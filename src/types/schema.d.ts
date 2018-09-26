export interface ISdkOptions {
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

export interface ISimpleSchema<PartitionKey> {
  tableName: string,
  partitionKey: PartitionKey,
}

export interface ICompositeSchema<PartitionKey, SortKey> {
  tableName: string,
  partitionKey: PartitionKey,
  sortKey: SortKey,
}