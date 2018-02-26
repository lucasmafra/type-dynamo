import { scan as Scan, ScanResult } from '../databaseOperations/scan'
import { EntitySchema } from './'

export class DynamoEntity<
    Entity,
    KeySchema
> {

    public _entitySchema: EntitySchema

    constructor(
        entitySchema: EntitySchema,
    ) {
        this._entitySchema = entitySchema
    }

    public scan() {
        return Scan<Entity, KeySchema>(this._entitySchema)
    }

    public query() {
        return Scan<Entity, KeySchema>(this._entitySchema)
    }

}
