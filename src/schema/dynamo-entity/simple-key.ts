import { IEntitySchema } from '../'

export class DynamoEntityWithSimpleKey<
    Entity,
    PartitionKey,
    KeySchema
> {

    protected _entitySchema: IEntitySchema

    constructor(
        entitySchema: IEntitySchema,
    ) {
        this._entitySchema = entitySchema
    }

}
