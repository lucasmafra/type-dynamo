import { scan as Scan, ScanResult } from '../databaseOperations/scan'
import { IndexSchema } from './'
import { DynamoEntity } from './DynamoEntity'

class DynamoIndex<Index, KeySchema> extends DynamoEntity<Index, KeySchema> {

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

// declarar os gllobal indexes (index name, projection type e algumas options)
