import { IndexSchema } from '../'
import { DynamoQuery, DynamoScan } from '../../chaining/find'
import { DynamoEntityWithCompositeKey } from '../dynamo-entity'

export class DynamoIndexWithCompositeKey<Index, PartitionKey, SortKey>
    extends DynamoEntityWithCompositeKey<Index, PartitionKey, SortKey> {

    constructor(
        indexSchema: IndexSchema,
    ) {
        super({
            tableName: indexSchema.tableName,
            indexSchema,
        } as any)
    }

    public find(): DynamoScan<Index, PartitionKey & SortKey>

    public find(partitionKey: PartitionKey): DynamoQuery<Index, PartitionKey, SortKey>

    public find(args?: any): any {
        if (!args) {
            return new DynamoScan<Index, PartitionKey & SortKey>(this._entitySchema)
        }
        return new DynamoQuery<Index, PartitionKey, SortKey>({
            schema: this._entitySchema, partitionKey: args,
        })
    }
}
