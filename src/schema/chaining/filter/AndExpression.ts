import ConditionExpression from './ConditionExpression'
import Expression from './Expression'
import MatchExpression from './MatchExpression'
import NotExpression from './NotExpression'
import { ComparisonOperator, Operator } from './Operator'

export default class AndExpression extends Expression {

        constructor(currentStack: Expression[]) {
            super('and', currentStack)
            this.stack.push(this)
        }

        public condition(expression: MatchExpression | ConditionExpression | NotExpression): ConditionExpression {
            return new ConditionExpression(expression, this.stack)
        }

        public not(expression: MatchExpression | ConditionExpression | NotExpression): NotExpression {
            return new NotExpression(expression, this.stack)
        }

        public match(operand: string, operator: Operator): MatchExpression {
            if (operator.type === 'function') {
                return new MatchExpression(
                    operator.value + `(${operand},${operator.functionOperand})`,
                    operator.expressionAttributeValues,
                    this.stack,
                )
            } else {
                return new MatchExpression(
                    operand + ' ' + operator.value,
                    operator.expressionAttributeValues,
                    this.stack,
                )
            }
        }

        public attributeExists(attribute: string): MatchExpression {
            return new MatchExpression(
                `attribute_exists(${attribute})`,
                undefined,
                this.stack,
            )
        }

        public attributeNotExists(attribute: string): MatchExpression {
            return new MatchExpression(
                `attribute_not_exists(${attribute})`,
                undefined,
                this.stack,
            )
        }

        public size(attribute: string, operator: ComparisonOperator): MatchExpression {
            return new MatchExpression(
                `size(${attribute}) ${operator.value}`,
                operator.expressionAttributeValues,
                this.stack,
            )
        }
}
