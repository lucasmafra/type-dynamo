import { IndexSchema } from '../'
import { DynamoQuery, DynamoScan } from '../../chaining/find'
import { DynamoEntityWithCompositeKey } from '../dynamo-entity'

export class DynamoIndexWithCompositeKey<Index, PartitionKey, SortKey, KeySchema>
    extends DynamoEntityWithCompositeKey<Index, PartitionKey, SortKey, KeySchema> {

    constructor(
        indexSchema: IndexSchema,
    ) {
        super({
            tableName: indexSchema.tableName,
            indexSchema,
        } as any)
    }

    public find(): DynamoScan<Index, KeySchema>

    public find(partitionKey: PartitionKey): DynamoQuery<Index, PartitionKey, SortKey, KeySchema>

    public find(args?: any): any {
        if (!args) {
            return new DynamoScan<Index, KeySchema>(this._entitySchema)
        }
        return new DynamoQuery<Index, PartitionKey, SortKey, KeySchema>({
            schema: this._entitySchema, partitionKey: args,
        })
    }
}
