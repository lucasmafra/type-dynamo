import { Chaining } from './'

export type AllResultsType = 'allResults'

export class CommonAllResults<ChainingKind> extends Chaining<ChainingKind | AllResultsType> {

    constructor(
        currentStack: Array<Chaining<ChainingKind>>,
    ) {
        super('allResults', currentStack)
        this._stack.push(this)
    }

}
