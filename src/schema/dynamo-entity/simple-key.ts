import { EntitySchema } from '../'

export class DynamoEntityWithSimpleKey<
    Entity,
    PartitionKey,
    KeySchema
> {

    protected _entitySchema: EntitySchema

    constructor(
        entitySchema: EntitySchema,
    ) {
        this._entitySchema = entitySchema
    }

}
