import { WithSortKeyCondition  } from '../chaining/find/query/with-sort-key-condition'
import { randomGenerator } from '../helpers/random-generator'

export function buildExclusiveStartKey<KeySchema>(lastKey: KeySchema) {
    let result = {}
    for (const propertyKey in lastKey) {
        if (lastKey.hasOwnProperty(propertyKey)) {
            result = Object.assign({}, result, {
                [propertyKey]: {
                    [typeof lastKey[propertyKey] === 'string' ? 'S' : 'N']: lastKey[propertyKey].toString(),
                },
            })
        }
    }
    return result
}

export function projectionExpression(attributes: string[]) {
    const result = attributes.reduce((acc, currentValue) => {
        return acc + currentValue + ','
    }, '')
    return result.slice(0, result.length - 1)
}

export function buildKey<KeySchema>(key: KeySchema) {
    let result = {}
    for (const propertyKey in key) {
        if (key.hasOwnProperty(propertyKey)) {
            result = Object.assign({}, result, {
                [propertyKey]: {
                    [typeof key[propertyKey] === 'string' ? 'S' : 'N']: key[propertyKey].toString(),
                },
            })
        }
    }
    return result
}

export function mergeExpressionAttributeNames(...args: Array<{ [key: string]: string } | undefined>) {
    let result = {}
    for (const expression of args) {
        if (expression) {
            result = Object.assign({}, result, expression)
        }
    }
    return Object.keys(result).length ? result : undefined
}

export function mergeExpressionAttributeValues(...args: Array<{ [key: string]: {
    [key: string]: string | number,
} } | undefined>) {
    let result = {}
    for (const expression of args) {
        if (expression) {
            result = Object.assign({}, result, expression)
        }
    }
    return Object.keys(result).length ? result : undefined
}

export function buildKeyConditionExpression<PartitionKey>(
    partitionKey: PartitionKey,
    withSortKeyCondition?: WithSortKeyCondition,
) {
    let keyConditionExpression: string = ''
    let expressionAttributeNames = {}
    let expressionAttributeValues = {}
    for (const partitionKeyName in partitionKey) {
        if (partitionKey.hasOwnProperty(partitionKeyName)) {
            const randomIdName = '#' + randomGenerator()
            const randomIdValue = ':' + randomGenerator()
            keyConditionExpression += `${randomIdName} = ${randomIdValue}`
            expressionAttributeNames[randomIdName] = partitionKeyName
            expressionAttributeValues[randomIdValue] = {
                [typeof partitionKey[partitionKeyName] === 'string' ? 'S' : 'N']: partitionKey[partitionKeyName],
            }
        }
    }
    if (withSortKeyCondition) {
        keyConditionExpression += ` AND ${withSortKeyCondition.expression}`
        expressionAttributeNames = Object.assign(
            {}, expressionAttributeNames, withSortKeyCondition.expressionAttributeNames,
        )
        expressionAttributeValues = Object.assign(
            {}, expressionAttributeValues, withSortKeyCondition.expressionAttributeValues,
        )
    }
    return {
        keyConditionExpression,
        expressionAttributeNames,
        expressionAttributeValues,
    }
}

export const deepClone = (obj: object) => JSON.parse(JSON.stringify(obj))
export const timeoutPromise = (time: number) => setTimeout(() => new Promise((resolve, reject) => {
    resolve()
}), time)
