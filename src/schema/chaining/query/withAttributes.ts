import { EntitySchema } from '../../'
import Expression from '../expressions/Expression'
import { randomGenerator } from '../expressions/randomGenerator'
import { allResults } from './allResults'
import { paginate } from './paginate'
import { SortKeyCondition } from './withSortKeyCondition'

export default class DynamoQueryWithAttributes<
    Entity,
    PartitionKey,
    SortKey
> {

    private _entitySchema: EntitySchema
    private _attributes: string[]
    private _expression?: Expression
    private _expressionAttributeNames: {
        [key: string]: string,
    }
    private _partitionKey: PartitionKey
    private _sortKeyCondition?: SortKeyCondition

    constructor(
        entitySchema: EntitySchema,
        attributes: string[],
        partitionKey: PartitionKey,
        expression?: Expression,
        sortKeyCondition?: SortKeyCondition,
    ) {
        this._entitySchema = entitySchema
        this.generateExpressionAttributeNames(attributes)
        this._expression = expression
        this._sortKeyCondition = sortKeyCondition
        this._partitionKey = partitionKey
    }

    public paginate(limit?: number, lastKey?: PartitionKey & SortKey) {
        return paginate<Entity, PartitionKey, SortKey>(
            this._entitySchema, limit, this._partitionKey, lastKey, this._expression, this._sortKeyCondition, {
                attributes: this._attributes,
                expressionAttributeNames: this._expressionAttributeNames,
            },
        )
    }

    public allResults() {
        return allResults<Entity, PartitionKey, SortKey>(
            this._entitySchema, this._partitionKey, this._expression, this._sortKeyCondition, {
                attributes: this._attributes,
                expressionAttributeNames: this._expressionAttributeNames,
            },
        )
    }

    private generateExpressionAttributeNames(attributes: string[]) {
        this._attributes = new Array<string>()
        this._expressionAttributeNames = attributes.reduce((acc, value) => {
            const randomId = '#' + randomGenerator()
            acc[randomId] = value
            this._attributes.push(randomId)
            return acc
        }, {})
    }

}

export function withAttributes<Entity, PartitionKey, SortKey, Attributes extends keyof Entity>(
    entitySchema: EntitySchema, attributes: Attributes[], partitionKey: PartitionKey,
    expression?: Expression, sortKeyCondition?: SortKeyCondition,
): DynamoQueryWithAttributes<Pick<Entity, Attributes>, PartitionKey, SortKey> {
    return new DynamoQueryWithAttributes<Pick<Entity, Attributes>, PartitionKey, SortKey>(
        entitySchema, attributes, partitionKey, expression, sortKeyCondition,
    )
}
