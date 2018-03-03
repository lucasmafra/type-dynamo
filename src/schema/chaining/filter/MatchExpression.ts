import AndExpression from './AndExpression'
import Expression from './Expression'
import { ExpressionAttributeValues } from './Operator'
import OrExpression from './OrExpression'

export default class MatchExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    public matchValue: string
    public expressionAttributeValues?: ExpressionAttributeValues

    constructor(
    matchValue: string,
    expressionAttributeValues?: ExpressionAttributeValues,
    currentStack?: Expression[],
) {
        super('match', currentStack)
        this.matchValue = matchValue
        this.expressionAttributeValues = expressionAttributeValues
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}
