import Expression from '../expressions/Expression'
import { Chaining } from './'

export type FilterType = 'filter'

export interface Filter {
    filterExpression: Expression,
}

export class CommonFilter<ChainingKind> extends Chaining<ChainingKind | FilterType> {

    private _filter: Filter

    constructor(
        filterExpression: Expression,
        currentStack: Array<Chaining<ChainingKind>>,
    ) {
        super('filter', currentStack)
        this._filter = { filterExpression }
        this._stack.push(this)
    }

}
