import ConditionExpression from './ConditionExpression'
import Expression from './Expression'
import MatchExpression from './MatchExpression'
import NotExpression from './NotExpression'

export function resolveExpression(expressionStack: Expression[]): string {
    return expressionStack.reduce((acc, expression) => {
        switch (expression.kind) {
            case 'condition': {
                return acc + '(' + resolveExpression((expression as ConditionExpression).conditionStack) + ')'
            }
            case 'not': {
                return acc + 'NOT (' + resolveExpression((expression as NotExpression).notStack) + ')'
            }
            case 'match': {
                return acc + (expression as MatchExpression).operand + ' ' +
                (expression as MatchExpression).operator
            }
            case 'and': {
                return acc + ' and '
            }
            case 'or': {
                return acc + ' or '
            }
        }
        return acc
    }, '')
}
