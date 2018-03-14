import { IndexSchema } from '../'
import { DynamoQuery, DynamoScan } from '../../chaining/find'
import { Omit } from '../../helpers'
import { DynamoEntityWithSimpleKey } from '../dynamo-entity'

export class DynamoIndexWithSimpleKey<Index, PartitionKey>
    extends DynamoEntityWithSimpleKey<Index, PartitionKey> {

    constructor(
        indexSchema: IndexSchema,
    ) {
        super({
            tableName: indexSchema.tableName,
            indexSchema,
        } as any)
    }

    public find(): DynamoScan<Index, PartitionKey>

    public find(partitionKey: PartitionKey): Omit<DynamoQuery<Index, PartitionKey, {}>, 'withSortKeyCondition'>

    public find(args?: any): any {
        if (!args) {
            return new DynamoScan<Index, PartitionKey>(this._entitySchema)
        }
        return new DynamoQuery<Index, PartitionKey, {}>({
            schema: this._entitySchema, partitionKey: args,
        })
    }

}
