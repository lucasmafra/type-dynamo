import { IndexSchema, ITableSchema } from '../'
import DynamoClient from '../../operations/dynamo-client'
import { DynamoTableWithCompositeKey } from '../dynamo-table'

export class DynamoORMWithCompositeKey<
    Table,
    PartitionKey,
    SortKey,
    GlobalIndexes,
    LocalIndexes
> extends DynamoTableWithCompositeKey<Table, PartitionKey, SortKey> {
    public onIndex: GlobalIndexes & LocalIndexes
    private globalIndexes: GlobalIndexes
    private localIndexes: LocalIndexes
    constructor(
        tableSchema: ITableSchema,
        globalIndexes: GlobalIndexes,
        localIndexes: LocalIndexes,
        dynamoClient: DynamoClient,
    ) {
        super(tableSchema, dynamoClient)
        this.globalIndexes = globalIndexes
        this.localIndexes = localIndexes
        this.onIndex = Object.assign({}, this.globalIndexes, this.localIndexes)
        this.injectTableNameOnIndexes()
        this.injectDynamoClientOnIndexes()
    }

    private injectTableNameOnIndexes() {
        for (const index in this.onIndex as any) {
            if (this.onIndex.hasOwnProperty(index)) {
                this.onIndex[index]._entitySchema.tableName = (this as any)._entitySchema.tableName
            }
        }
    }
    private injectDynamoClientOnIndexes() {
        for (const index in this.onIndex as any) {
            if (this.onIndex.hasOwnProperty(index)) {
                this.onIndex[index]._entitySchema.dynamoClient = (this as any)._entitySchema.dynamoClient
            }
        }
    }
}
