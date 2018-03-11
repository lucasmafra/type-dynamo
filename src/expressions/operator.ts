export interface ExpressionAttributeValues {
    [key: string]: {
        [attributeType: string]: string | number,
    },
}
export interface Operator {
    value: string
    functionOperand?: string
    type: 'function' | 'comparison',
    expressionAttributeValues: ExpressionAttributeValues
    kind: 'beginsWith' | 'isEqualTo' | 'isNotEqualTo' | 'isGreaterThan' | 'isLessThan' | 'isLessOrEqualTo'
    | 'isGreaterOrEqualTo' | 'isBetween' | 'contains' | 'isIn'
}

export interface ComparisonOperator extends Operator {
    type: 'comparison',
}

export interface FunctionOperator extends Operator {
    type: 'function',
}

export interface BeginsWith extends FunctionOperator {
    kind: 'beginsWith'
}

export interface Contains extends FunctionOperator {
    kind: 'contains'
}

export interface IsIn extends ComparisonOperator {
    kind: 'isIn'
}

export interface IsEqualTo extends ComparisonOperator {
    kind: 'isEqualTo'
}

export interface IsNotEqualTo extends ComparisonOperator {
    kind: 'isNotEqualTo'
}

export interface IsGreaterThan extends ComparisonOperator {
    kind: 'isGreaterThan'
}

export interface IsLessThan extends ComparisonOperator {
    kind: 'isLessThan'
}

export interface IsLessOrEqualTo extends ComparisonOperator {
    kind: 'isLessOrEqualTo'
}

export interface IsGreaterOrEqualTo extends ComparisonOperator {
    kind: 'isGreaterOrEqualTo'
}

export interface IsBetween extends ComparisonOperator {
    kind: 'isBetween'
}
