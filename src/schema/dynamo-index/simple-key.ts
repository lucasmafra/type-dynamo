import { IndexSchema } from '../'
import { DynamoQuery, DynamoScan } from '../../chaining/find'
import { Omit } from '../../helpers'
import { DynamoEntityWithSimpleKey } from '../dynamo-entity'

export class DynamoIndexWithSimpleKey<Index, PartitionKey, KeySchema>
    extends DynamoEntityWithSimpleKey<Index, PartitionKey, KeySchema> {

    constructor(
        indexSchema: IndexSchema,
    ) {
        super({
            tableName: indexSchema.tableName,
            indexSchema,
        } as any)
    }

    public find(): DynamoScan<Index, KeySchema>

    public find(partitionKey: PartitionKey):
        Omit<DynamoQuery<Index, PartitionKey, {}, KeySchema>, 'withSortKeyCondition'>

    public find(args?: any): any {
        if (!args) {
            return new DynamoScan<Index, KeySchema>(this._entitySchema)
        }
        return new DynamoQuery<Index, PartitionKey, {}, KeySchema>({
            schema: this._entitySchema, partitionKey: args,
        })
    }

}
