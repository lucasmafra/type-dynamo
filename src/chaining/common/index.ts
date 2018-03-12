export abstract class Chaining<ChainingKind> {

    protected _kind: ChainingKind
    protected _stack: Array<Chaining<ChainingKind>>

    constructor(
        kind: ChainingKind, currentStack?: Array<Chaining<ChainingKind>>,
    ) {
        this._stack = currentStack || new Array<Chaining<ChainingKind>>()
        this._kind = kind
    }

}

export * from './with-attributes'
export * from './with-condition'
export * from './paginate'
export * from './filter'
export * from './all-results'
