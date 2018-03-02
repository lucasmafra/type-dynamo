import ConditionExpression from './ConditionExpression'
import Expression from './Expression'
import MatchExpression from './MatchExpression'

export default class AndExpression extends Expression {

        constructor(currentStack: Expression[]) {
            super('and', currentStack)
            this.stack.push(this)
        }

        public condition(expression: MatchExpression): ConditionExpression {
            return new ConditionExpression(expression, this.stack)
        }
        public match(operand: string, operator: string): MatchExpression {
            return new MatchExpression(operand, operator, this.stack)
        }
}
