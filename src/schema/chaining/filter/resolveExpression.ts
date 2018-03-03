import ConditionExpression from './ConditionExpression'
import Expression from './Expression'
import MatchExpression from './MatchExpression'
import NotExpression from './NotExpression'

interface ResolvedExpression {
    resolvedExpression: string,
    expressionAttributeValues: { [key: string]: string}
}

export function resolveExpression(expressionStack: Expression[]): ResolvedExpression {
    return expressionStack.reduce((acc, expression) => {
        switch (expression.kind) {
            case 'condition': {
                acc.resolvedExpression +=
                '(' + resolveExpression((expression as ConditionExpression).conditionStack) + ')'
                return acc
            }
            case 'not': {
                acc.resolvedExpression +=
                'NOT (' + resolveExpression((expression as NotExpression).notStack) + ')'
                return acc
            }
            case 'and': {
                acc.resolvedExpression += ' and '
                return acc
            }
            case 'or': {
                acc.resolvedExpression += ' or '
                return acc
            }
            case 'match': {
                acc.resolvedExpression += (expression as MatchExpression).matchValue
                acc.expressionAttributeValues = Object.assign(
                    {},
                    acc.expressionAttributeValues,
                    (expression as MatchExpression).expressionAttributeValues)
                return acc
            }
        }
        return acc
    }, {
        resolvedExpression: '',
        expressionAttributeValues: {},
    })
}
