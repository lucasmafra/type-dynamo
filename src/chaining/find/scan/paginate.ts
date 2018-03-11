import { Chaining, CommonPaginate, Paginate } from '../../common'
import { ScanChainingKind } from './'
import { executePaginate } from './execute'

export class DynamoScanPaginate<
    Entity,
    KeySchema
> extends CommonPaginate<ScanChainingKind, KeySchema> {

    constructor(
        currentStack: Array<Chaining<ScanChainingKind>>,
        paginate?: Paginate<KeySchema>,
    ) {
        super(currentStack, paginate)
    }

    public execute() {
        return executePaginate<Entity, KeySchema>(this._stack)
    }

}
