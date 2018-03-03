import AndExpression from './AndExpression'
import Expression from './Expression'
import MatchExpression from './MatchExpression'
import NotExpression from './NotExpression'
import OrExpression from './OrExpression'

export default class ConditionExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    public conditionStack: Expression[]
    constructor(expression: MatchExpression | ConditionExpression | NotExpression, currentStack?: Expression[]) {
        super('condition', currentStack)
        this.conditionStack = expression.stack.slice()
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}
