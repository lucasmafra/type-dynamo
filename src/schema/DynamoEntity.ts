import { scan as Scan, ScanResult } from '../databaseOperations/scan'
import { EntitySchema } from './'
import DynamoScan from './chaining/scan/Scan'

export class DynamoEntity<
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

    public scan() {
        return new DynamoScan<Entity, PartitionKey & SortKey>(this._entitySchema)
    }

    public query() {
        // return new DynamoQuery<Entity, PartitionKey, SortKey>(this._entitySchema)
    }

}
