import { IndexSchema } from '../'
import { DynamoQuery, DynamoScan } from '../../chaining/find'
import { DynamoEntityWithSimpleKey } from '../dynamo-entity'

type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>

export class DynamoIndexWithSimpleKey<Index, PartitionKey>
    extends DynamoEntityWithSimpleKey<Index, PartitionKey> {

    constructor(
        indexSchema: IndexSchema,
    ) {
        super({
            tableName: indexSchema.tableName,
            indexSchema,
        })
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
