import { IEntitySchema } from '../'

export class DynamoEntityWithCompositeKey<
    Entity,
    PartitionKey,
    SortKey,
    KeySchema
> {

    protected _entitySchema: IEntitySchema

    constructor(
        entitySchema: IEntitySchema,
    ) {
        this._entitySchema = entitySchema
    }
}
