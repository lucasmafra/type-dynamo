import { IndexSchema } from '../'
import { DynamoEntityWithSimpleKey } from '../dynamo-entity'

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

}
