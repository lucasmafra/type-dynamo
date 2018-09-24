import ConditionExpression from './condition'
import Expression from './expression'
import MatchExpression from './match'
import NotExpression from './not'
import { ComparisonOperator, Operator } from './operator'
import { randomGenerator } from '../helpers/random-generator'

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
            const randomId = '#' + randomGenerator()
            const expressionAttributeNames = {
                [randomId]: operand,
            }
            if (operator.type === 'function') {
                return new MatchExpression(
                    operator.value + `(${randomId},${operator.functionOperand})`,
                    expressionAttributeNames,
                    operator.expressionAttributeValues,
                    this.stack,
                )
            } else {
                return new MatchExpression(
                    randomId + ' ' + operator.value,
                    expressionAttributeNames,
                    operator.expressionAttributeValues,
                    this.stack,
                )
            }
        }

        public attributeExists(attribute: string): MatchExpression {
            const randomId = '#' + randomGenerator()
            const expressionAttributeNames = {
                [randomId]: attribute,
            }
            return new MatchExpression(
                `attribute_exists(${randomId})`,
                expressionAttributeNames,
                undefined,
                this.stack,
            )
        }

        public attributeNotExists(attribute: string): MatchExpression {
            const randomId = '#' + randomGenerator()
            const expressionAttributeNames = {
                [randomId]: attribute,
            }
            return new MatchExpression(
                `attribute_not_exists(${randomId})`,
                expressionAttributeNames,
                undefined,
                this.stack,
            )
        }

        public size(attribute: string, operator: ComparisonOperator): MatchExpression {
            const randomId = '#' + randomGenerator()
            const expressionAttributeNames = {
                [randomId]: randomId,
            }
            return new MatchExpression(
                `size(${randomId}) ${operator.value}`,
                expressionAttributeNames,
                operator.expressionAttributeValues,
                this.stack,
            )
        }
}
