import AndExpression from './AndExpression'
import ConditionExpression from './ConditionExpression'
import Expression from './Expression'
import MatchExpression from './MatchExpression'
import OrExpression from './OrExpression'

export default class NotExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    public notStack: Expression[]
    constructor(expression: MatchExpression | ConditionExpression | NotExpression, currentStack?: Expression[]) {
        super('not', currentStack)
        this.notStack = expression.stack.slice()
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}
