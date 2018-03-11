import AndExpression from './and'
import Expression from './expression'
import { ExpressionAttributeValues } from './operator'
import OrExpression from './or'

export default class MatchExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    protected matchValue: string
    protected expressionAttributeNames?: {
        [key: string]: string,
    }
    protected expressionAttributeValues?: ExpressionAttributeValues

    constructor(
    matchValue: string,
    expressionAttributeNames?: {
        [key: string]: string,
    },
    expressionAttributeValues?: ExpressionAttributeValues,
    currentStack?: Expression[],
) {
        super('match', currentStack)
        this.matchValue = matchValue
        this.expressionAttributeNames = expressionAttributeNames
        this.expressionAttributeValues = expressionAttributeValues
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}
