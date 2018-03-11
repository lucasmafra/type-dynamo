import AndExpression from './and'
import Expression from './expression'
import MatchExpression from './match'
import NotExpression from './not'
import OrExpression from './or'

export default class ConditionExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    protected conditionStack: Expression[]
    constructor(expression: MatchExpression | ConditionExpression | NotExpression, currentStack?: Expression[]) {
        super('condition', currentStack)
        this.conditionStack = (expression as any).stack.slice()
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}
