import { EntitySchema } from '../'

export class DynamoEntityWithSimpleKey<
    Entity,
    PartitionKey
> {

    protected _entitySchema: EntitySchema

    constructor(
        entitySchema: EntitySchema,
    ) {
        this._entitySchema = entitySchema
    }

}
