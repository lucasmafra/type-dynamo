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
}

export interface ComparisonOperator extends Operator {
    type: 'comparison',
}

export interface FunctionOperator extends Operator {
    type: 'function',
}
