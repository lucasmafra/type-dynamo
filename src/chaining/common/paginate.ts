import { Chaining } from './'

export type PaginateType = 'paginate'

export interface Paginate<KeySchema> {
    limit?: number,
    lastKey?: KeySchema
}

export class CommonPaginate<ChainingKind, KeySchema> extends Chaining<ChainingKind | PaginateType> {

    private _paginate?: Paginate<KeySchema>

    constructor(
        currentStack: Array<Chaining<ChainingKind>>,
        paginate?: Paginate<KeySchema>,
    ) {
        super('paginate', currentStack)
        this._paginate = paginate
        this._stack.push(this)
    }

}
