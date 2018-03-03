import ConditionExpression from './ConditionExpression'
import MatchExpression from './MatchExpression'
import NotExpression from './NotExpression'
import { ComparisonOperator, FunctionOperator, Operator } from './Operator'
import { resolveExpression } from './resolveExpression'

const randomGenerator = () => Math.random().toString(36).slice(2)

export function condition(expression: ConditionExpression | MatchExpression | NotExpression): ConditionExpression {
    return new ConditionExpression(expression)
}

export function not(expression: ConditionExpression | MatchExpression | NotExpression): NotExpression {
    return new NotExpression(expression)
}

export function match(operand: string, operator: Operator): MatchExpression {
    if (operator.type === 'function') {
        return new MatchExpression(
            operator.value + `(${operand},${operator.functionOperand})`,
            operator.expressionAttributeValues,
        )
    } else {
        return new MatchExpression(
            operand + ' ' + operator.value,
            operator.expressionAttributeValues,
        )
    }
}

export function attributeExists(attribute: string): MatchExpression {
    return new MatchExpression(
        `attribute_exists(${attribute})`,
    )
}

export function attributeNotExists(attribute: string): MatchExpression {
    return new MatchExpression(
        `attribute_not_exists(${attribute})`,
    )
}

export function size(attribute: string, operator: ComparisonOperator): MatchExpression {
    return new MatchExpression(
        `size(${attribute}) ${operator.value}`,
        operator.expressionAttributeValues,
    )
}

export function beginsWith(subString: string): FunctionOperator {
    const randomId = ':' + randomGenerator()
    return {
        value: 'beginsWith',
        functionOperand: randomId,
        type: 'function',
        expressionAttributeValues: {
            [randomId]: {
                ['S']: subString,
            },
        },
    }
}

export function contains(operand: string): FunctionOperator {
    const randomId = ':' + randomGenerator()
    return {
        value: 'contains',
        functionOperand: randomId,
        type: 'function',
        expressionAttributeValues: {
            [randomId]: {
                ['S']: operand,
            },
        },
    }
}

export function isEqualTo(a: number | string): ComparisonOperator {
    const randomId = ':' + randomGenerator()
    const type = typeof a === 'string' ? 'S' : 'N'
    return {
        value: `= ${randomId}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId]: {
                [type]: a.toString(),
            },
        },
    }
}

export function isNotEqualTo(a: number | string): ComparisonOperator {
    const randomId = ':' + randomGenerator()
    const type = typeof a === 'string' ? 'S' : 'N'
    return {
        value: `<> ${randomId}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId]: {
                [type]: a.toString(),
            },
        },
    }
}

export function isGreatherThan(a: number | string): ComparisonOperator {
    const randomId = ':' + randomGenerator()
    const type = typeof a === 'string' ? 'S' : 'N'
    return {
        value: `> ${randomId}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId]: {
                [type]: a.toString(),
            },
        },
    }
}

export function isLessThan(a: number | string): ComparisonOperator {
    const randomId = ':' + randomGenerator()
    const type = typeof a === 'string' ? 'S' : 'N'
    return {
        value: `< ${randomId}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId]: {
                [type]: a.toString(),
            },
        },
    }
}

export function isLessOrEqualTo(a: number | string): ComparisonOperator {
    const randomId = ':' + randomGenerator()
    const type = typeof a === 'string' ? 'S' : 'N'
    return {
        value: `<= ${randomId}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId]: {
                [type]: a.toString(),
            },
        },
    }
}

export function isGreaterOrEqualTo(a: number | string): ComparisonOperator {
    const randomId = ':' + randomGenerator()
    const type = typeof a === 'string' ? 'S' : 'N'
    return {
        value: `>= ${randomId}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId]: {
                [type]: a.toString(),
            },
        },
    }
}

export function isBetween(b: number, c: number): ComparisonOperator {
    const randomId1 = ':' + randomGenerator()
    const randomId2 = ':' + randomGenerator()
    return {
        value: `BETWEEN ${randomId1} AND ${randomId2}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId1]: {
                ['N']: b.toString(),
            },
            [randomId2]: {
                ['N']: c.toString(),
            },
        },
    }
}

export function isIn(values: string[]): ComparisonOperator {
    const randomIds = new Array<string>()
    const expressionAttributeValues = values.reduce((acc, value) => {
        const randomId = ':' + randomGenerator()
        acc[randomId] = {
            ['S']: value,
        }
        randomIds.push(randomId)
        return acc
    }, {})
    const result = randomIds.reduce((acc, value) => {
        return acc + value.toString() + ', '
    }, `IN (`)
    return {
        value: result.slice(0, result.length - 2) + ')',
        type: 'comparison',
        expressionAttributeValues,
    }
}
