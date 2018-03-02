abstract class Expression {

    public stack: Expression[]
    public kind: string
    constructor(kind: string, stack?: Expression[]) {
        this.kind = kind
        this.stack = stack ? stack.slice() : new Array<Expression>()
    }
}

class AndExpression extends Expression {

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

class OrExpression extends Expression {

    constructor(currentStack: Expression[]) {
        super('or', currentStack)
        this.stack.push(this)
    }

    public condition(expression: MatchExpression): ConditionExpression {
        return new ConditionExpression(expression, this.stack)
    }
    public match(operand: string, operator: string): MatchExpression {
        return new MatchExpression(operand, operator, this.stack)
    }
}

class ConditionExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    public conditionStack: Expression[]
    constructor(expression: ConditionExpression | MatchExpression, currentStack?: Expression[]) {
        super('condition', currentStack)
        this.conditionStack = expression.stack.slice()
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}

class MatchExpression extends Expression {
    public and: AndExpression
    public or: OrExpression
    public operand: string
    public operator: string
    constructor(operand: string, operator: string, currentStack?: Expression[]) {
        super('match', currentStack)
        this.operand = operand
        this.operator = operator
        this.stack.push(this)
        this.and = new AndExpression(this.stack)
        this.or = new OrExpression(this.stack)
    }
}

export function condition(expression: ConditionExpression | MatchExpression): ConditionExpression {
    return new ConditionExpression(expression)
}

export function match(operand: string, operator: string): MatchExpression {
    return new MatchExpression(operand, operator)
}

function isGreatherThan(a: number) {
    return `> ${a}`
}

function isLessThan(a: number) {
    return `< ${a}`
}

function isEqualTo(a: number | string) {
    return `= ${a}`
}

// const x = condition(match('id', isGreatherThan(5)).and.match('age', isLessThan(20)))

const y =
        condition(
            match('id', isGreatherThan(5))
            .or.
            match('age', isLessThan(20))
            .and.
            match('name', isLessThan(50)),
        )
        .and.
        condition(
            match('age', isLessThan(20)),
        )
        .or.
        condition(
            match('age', isLessThan(20))
            .and.
            match('color', isEqualTo('yellow'))
            .or.
            match('age', isLessThan(20)),
        )

export function resolveExpression(expressionStack: Expression[]): string {
    return expressionStack.reduce((acc, expression) => {
        switch (expression.kind) {
            case 'condition': {
                return acc + '(' + resolveExpression((expression as ConditionExpression).conditionStack) + ')'
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
console.log(resolveExpression(y.stack))
