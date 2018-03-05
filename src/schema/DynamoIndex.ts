import { scan as Scan, ScanResult } from '../databaseOperations/scan'
import { IndexSchema } from './'
import { DynamoEntity } from './DynamoEntity'

class DynamoIndex<Index, PartitionKey, SortKey>
    extends DynamoEntity<Index, PartitionKey, SortKey> {

    constructor(
        indexSchema: IndexSchema,
    ) {
        super({
            tableName: indexSchema.tableName,
            indexSchema,
        })
    }

}

export default DynamoIndex
