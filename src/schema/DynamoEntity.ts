import { scan as Scan, ScanResult } from '../databaseOperations/scan'
import { EntitySchema } from './'
import DynamoScan from './chaining/scan/Scan'

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
        return new DynamoScan<Entity, KeySchema>(this._entitySchema)
    }

    public query() {
        return new DynamoScan<Entity, KeySchema>(this._entitySchema)
    }

}
