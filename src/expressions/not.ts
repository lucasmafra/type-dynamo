import AndExpression from './and'
import ConditionExpression from './condition'
import Expression from './expression'
import MatchExpression from './match'
import OrExpression from './or'

export default class NotExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    protected notStack: Expression[]
    constructor(expression: MatchExpression | ConditionExpression | NotExpression, currentStack?: Expression[]) {
        super('not', currentStack)
        this.notStack = (expression as any).stack.slice()
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}
