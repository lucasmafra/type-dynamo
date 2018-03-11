import ConditionExpression from './ConditionExpression'
import Expression from './Expression'
import MatchExpression from './MatchExpression'
import NotExpression from './NotExpression'

export interface ResolvedExpression {
    resolvedExpression: string,
    expressionAttributeNames: { [key: string]: string}
    expressionAttributeValues: { [key: string]: {
        [key: string]: string | number,
    }}
}

export function resolveExpression(expressionStack: Expression[]): ResolvedExpression {
    return expressionStack.reduce((acc, expression) => {
        switch ((expression as any).kind) {
            case 'condition': {
                acc.resolvedExpression +=
                '(' + resolveExpression((expression as any).conditionStack) + ')'
                return acc
            }
            case 'not': {
                acc.resolvedExpression +=
                'NOT (' + resolveExpression((expression as any).notStack) + ')'
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
                acc.resolvedExpression += (expression as any).matchValue
                acc.expressionAttributeValues = Object.assign(
                    {},
                    acc.expressionAttributeValues,
                    (expression as any).expressionAttributeValues)
                acc.expressionAttributeNames = Object.assign(
                    {},
                    acc.expressionAttributeNames,
                    (expression as any).expressionAttributeNames,
                )
                return acc
            }
        }
        return acc
    }, {
        resolvedExpression: '',
        expressionAttributeValues: {},
        expressionAttributeNames: {},
    })
}
