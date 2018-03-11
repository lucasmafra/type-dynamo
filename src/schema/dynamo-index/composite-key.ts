import { IndexSchema } from '../'
import { DynamoEntityWithCompositeKey } from '../dynamo-entity'

export class DynamoIndexWithCompositeKey<Index, PartitionKey, SortKey>
    extends DynamoEntityWithCompositeKey<Index, PartitionKey, SortKey> {

    constructor(
        indexSchema: IndexSchema,
    ) {
        super({
            tableName: indexSchema.tableName,
            indexSchema,
        })
    }

}
