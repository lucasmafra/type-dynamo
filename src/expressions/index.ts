import ConditionExpression from './condition'
import MatchExpression from './match'
import NotExpression from './not'
import {
    BeginsWith, ComparisonOperator, Contains, FunctionOperator, IsBetween, IsEqualTo,
    IsGreaterOrEqualTo, IsGreaterThan, IsIn, IsLessOrEqualTo, IsLessThan, IsNotEqualTo, Operator,
 } from './operator'
import { randomGenerator } from './random-generator'
import { resolveExpression } from './resolve-expression'

export function condition(expression: ConditionExpression | MatchExpression | NotExpression): ConditionExpression {
    return new ConditionExpression(expression)
}

export function not(expression: ConditionExpression | MatchExpression | NotExpression): NotExpression {
    return new NotExpression(expression)
}

export function match(operand: string, operator: Operator): MatchExpression {
    const randomId = '#' + randomGenerator()
    const expressionAttributeNames = {
        [randomId]: operand,
    }
    if (operator.type === 'function') {
        return new MatchExpression(
            operator.value + `(${randomId},${operator.functionOperand})`,
            expressionAttributeNames,
            operator.expressionAttributeValues,
        )
    } else {
        return new MatchExpression(
            randomId + ' ' + operator.value,
            expressionAttributeNames,
            operator.expressionAttributeValues,
        )
    }
}

export function attributeExists(attribute: string): MatchExpression {
    const randomId = '#' + randomGenerator()
    const expressionAttributeNames = {
        [randomId]: attribute,
    }
    return new MatchExpression(
        `attribute_exists(${randomId})`,
        expressionAttributeNames,
    )
}

export function attributeNotExists(attribute: string): MatchExpression {
    const randomId = '#' + randomGenerator()
    const expressionAttributeNames = {
        [randomId]: attribute,
    }
    return new MatchExpression(
        `attribute_not_exists(${randomId})`,
        expressionAttributeNames,
    )
}

export function size(attribute: string, operator: ComparisonOperator): MatchExpression {
    const randomId = '#' + randomGenerator()
    const expressionAttributeNames = {
        [randomId]: attribute,
    }
    return new MatchExpression(
        `size(${randomId}) ${operator.value}`,
        expressionAttributeNames,
        operator.expressionAttributeValues,
    )
}

export function beginsWith(subString: string): BeginsWith {
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
        kind: 'beginsWith',
    }
}

export function contains(operand: string): Contains {
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
        kind: 'contains',
    }
}

export function isEqualTo(a: number | string | boolean): IsEqualTo {
    const randomId = ':' + randomGenerator()
    let type
    switch (typeof  a) {
        case 'boolean': {
            type = 'BOOL'
            break
        }
        case 'number': {
            type = 'N'
            break
        }
        default: type = 'S'
    }
    return {
        value: `= ${randomId}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId]: {
                [type]: a.toString(),
            },
        },
        kind: 'isEqualTo',
    }
}

export function isNotEqualTo(a: number | string | boolean): IsNotEqualTo {
    const randomId = ':' + randomGenerator()
    let type
    switch (typeof  a) {
        case 'boolean': {
            type = 'BOOL'
            break
        }
        case 'number': {
            type = 'N'
            break
        }
        default: type = 'S'
    }
    return {
        value: `<> ${randomId}`,
        type: 'comparison',
        expressionAttributeValues: {
            [randomId]: {
                [type]: a.toString(),
            },
        },
        kind: 'isNotEqualTo',
    }
}

export function isGreaterThan(a: number | string): IsGreaterThan {
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
        kind: 'isGreaterThan',
    }
}

export function isLessThan(a: number | string): IsLessThan {
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
        kind: 'isLessThan',
    }
}

export function isLessOrEqualTo(a: number | string): IsLessOrEqualTo {
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
        kind: 'isLessOrEqualTo',
    }
}

export function isGreaterOrEqualTo(a: number | string): IsGreaterOrEqualTo {
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
        kind: 'isGreaterOrEqualTo',
    }
}

export function isBetween(b: number, c: number): IsBetween {
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
        kind: 'isBetween',
    }
}

export function isIn(values: string[]): IsIn {
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
        kind: 'isIn',
    }
}
