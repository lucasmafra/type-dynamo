export function projectionExpression(attributes: string[]) {
    const result = attributes.reduce((acc, currentValue) => {
        return acc + currentValue + ','
    }, '')
    return result.slice(0, result.length - 1)
}
