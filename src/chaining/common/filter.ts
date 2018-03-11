import Expression from '../../expressions/expression'
import { Chaining } from './'

export type FilterType = 'filter'

export interface Filter {
    filterExpression: Expression,
}

export class CommonFilter<ChainingKind> extends Chaining<ChainingKind | FilterType> {

    private _filter: Filter

    constructor(
        filter: Filter,
        currentStack: Array<Chaining<ChainingKind>>,
    ) {
        super('filter', currentStack)
        this._filter = filter
        this._stack.push(this)
    }

}
