import { EntitySchema } from '../'

export class DynamoEntityWithCompositeKey<
    Entity,
    PartitionKey,
    SortKey
> {

    protected _entitySchema: EntitySchema

    constructor(
        entitySchema: EntitySchema,
    ) {
        this._entitySchema = entitySchema
    }
}
