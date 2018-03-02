import ConditionExpression from './ConditionExpression'
import MatchExpression from './MatchExpression'
import NotExpression from './NotExpression'
import { resolveExpression } from './resolveExpression'

export function condition(expression: ConditionExpression | MatchExpression | NotExpression): ConditionExpression {
    return new ConditionExpression(expression)
}

export function not(expression: ConditionExpression | MatchExpression | NotExpression): NotExpression {
    return new NotExpression(expression)
}

export function match(operand: string, operator: string): MatchExpression {
    return new MatchExpression(operand, operator)
}

function isEqualTo(a: number | string) {
    return `= ${a}`
}

function isNotEqualTo(a: number | string) {
    return `<> ${a}`
}

function isGreatherThan(a: number | string) {
    return `> ${a}`
}

function isLessThan(a: number | string) {
    return `< ${a}`
}

function isLessOrEqualTo(a: number | string) {
    return `<= ${a}`
}

function isGreaterOrEqualTo(a: number | string) {
    return `< ${a}`
}

function isBetween(b: number, c: number) {
    return `BETWEEN ${b} AND ${c}`
}

function isIn(values: string[]) {
    const result = values.reduce((acc, value) => {
        return acc + value.toString() + ', '
    }, `IN (`)
    return result.slice(0, result.length - 2) + ')'
}
