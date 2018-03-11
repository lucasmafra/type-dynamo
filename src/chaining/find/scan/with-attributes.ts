import { randomGenerator } from '../../../expressions/random-generator'
import { Chaining, CommonWithAttributes } from '../../common'
import { ScanChainingKind } from './'
import { DynamoScanAllResults } from './all-results'
import { DynamoScanPaginate } from './paginate'

export class DynamoScanWithAttributes<
    Entity,
    KeySchema
> extends CommonWithAttributes<ScanChainingKind> {

    constructor(
        attributes: string[],
        currentStack: Array<Chaining<ScanChainingKind>>,
    ) {
        super(attributes, currentStack)
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return new DynamoScanPaginate<Entity, KeySchema>(this._stack, { limit, lastKey})
    }

    public allResults() {
        return new DynamoScanAllResults<Entity, KeySchema>(this._stack)
    }

}
