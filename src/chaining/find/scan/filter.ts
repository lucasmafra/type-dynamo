import Expression from '../../../expressions/expression'
import { Chaining, CommonFilter, Filter } from '../../common'
import { ScanChainingKind } from './'
import { DynamoScanAllResults } from './all-results'
import { DynamoScanPaginate } from './paginate'
import { DynamoScanWithAttributes } from './with-attributes'

export class DynamoScanFilter<
    Entity,
    KeySchema
> extends CommonFilter<ScanChainingKind> {

    constructor(
        filter: Filter,
        currentStack: Array<Chaining<ScanChainingKind>>,
    ) {
        super(filter, currentStack)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return new DynamoScanWithAttributes<Pick<Entity, K>, KeySchema>(
            attributes, this._stack,
        )
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return new DynamoScanPaginate<Entity, KeySchema>(this._stack, { limit, lastKey})
    }

    public allResults() {
        return new DynamoScanAllResults<Entity, KeySchema>(this._stack)
    }

}
