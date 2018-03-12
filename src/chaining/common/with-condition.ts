import Expression from '../../expressions/expression'
import { Chaining, CommonWithAttributes } from './'

export type WithConditionType = 'withCondition'
export interface WithCondition {
    expression: Expression
}

export class CommonWithCondition<ChainingKind> extends Chaining<ChainingKind | WithConditionType> {

    private _withCondition: WithCondition

    constructor(
        withCondition: WithCondition,
        currentStack: Array<Chaining<ChainingKind>>,
    ) {
        super('withCondition', currentStack)
        this._withCondition = withCondition
        this._stack.push(this)
    }

}
