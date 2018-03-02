import AndExpression from './AndExpression'
import Expression from './Expression'
import OrExpression from './OrExpression'

export default class MatchExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    public operand: string
    public operator: string
    constructor(operand: string, operator: string, currentStack?: Expression[]) {
        super('match', currentStack)
        this.operand = operand
        this.operator = operator
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}
