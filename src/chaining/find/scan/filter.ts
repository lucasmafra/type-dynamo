import { Chaining, CommonFilter } from '../../common'
import Expression from '../../expressions/Expression'
import { ScanChainingKind } from './'
import { DynamoScanAllResults } from './all-results'
import { DynamoScanPaginate } from './paginate'
import { DynamoScanWithAttributes } from './with-attributes'

export class DynamoScanFilter<
    Entity,
    KeySchema
> extends CommonFilter<ScanChainingKind> {

    constructor(
        filterExpression: Expression,
        currentStack: Array<Chaining<ScanChainingKind>>,
    ) {
        super(filterExpression, currentStack)
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
