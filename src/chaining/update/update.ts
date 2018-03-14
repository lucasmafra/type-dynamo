import Expression from '../../expressions/expression'
import { randomGenerator } from '../../expressions/random-generator'
import { ResolvedExpression } from '../../expressions/resolve-expression'
import { Diff, Omit } from '../../helpers'
import { EntitySchema } from '../../schema'
import { Chaining } from '../common'
import { UpdateChainingKind } from './'
import { execute } from './execute'
import { DynamoUpdateWithCondition } from './with-condition'
const marshalItem = require('dynamodb-marshaler').marshalItem

export type UpdateType = 'update'

export type ExplicitKeyItemType<Entity, KeySchema> =
    Partial<Pick<Entity, Diff<keyof Entity, keyof KeySchema>>>

export type ImplicityKeyItemType<Entity, KeySchema> = Partial<Entity> & KeySchema

export interface Update<KeySchema> {
    schema: EntitySchema,
    key: KeySchema,
    updateExpression: ResolvedExpression
}

export interface UpdateWithExplicitKey<Entity, KeySchema> {
    schema: EntitySchema,
    key: KeySchema,
    item: ExplicitKeyItemType<Entity, KeySchema>,
}

export interface UpdateWithImplicitKey<Entity, KeySchema> {
    schema: EntitySchema,
    item: ImplicityKeyItemType<Entity, KeySchema>,
}

function isUpdateWithExplicitKey<Entity, KeySchema>(
    update: UpdateWithExplicitKey<Entity, KeySchema> | UpdateWithImplicitKey<Entity, KeySchema>,
): update is UpdateWithExplicitKey<Entity, KeySchema> {
    return (update as any).key !== undefined
}

function isUpdateWithImplicitKey<Entity, KeySchema>(
    update: UpdateWithExplicitKey<Entity, KeySchema> | UpdateWithImplicitKey<Entity, KeySchema>,
): update is UpdateWithImplicitKey<Entity, KeySchema> {
    return (update as any).key === undefined
}

export class DynamoUpdate<
    Entity, KeySchema
> extends Chaining<UpdateChainingKind> {

    protected _update: Update<KeySchema>

    constructor(
        update: UpdateWithExplicitKey<Entity, KeySchema> | UpdateWithImplicitKey<Entity, KeySchema>,
    ) {
        super('update')
        if (isUpdateWithExplicitKey(update)) {
            this._update =  this.buildUpdateWithExplicitKey(update)
        } else if (isUpdateWithImplicitKey(update)) {
            this._update =  this.buildUpdateWithImplicitKey(update)
        }
        this._stack.push(this)
    }

    public withCondition(expression: Expression) {
        return new DynamoUpdateWithCondition<Entity, KeySchema>({ expression }, this._stack)
    }

    public execute() {
        return execute<Entity, KeySchema>(this._stack)
    }

    private buildUpdateWithExplicitKey(update: UpdateWithExplicitKey<Entity, KeySchema>): Update<KeySchema> {
        let resolvedExpression = 'SET'
        let expressionAttributeNames = {}
        let expressionAttributeValues = {}
        if (!Object.keys(update.item).length) {
            throw new Error('UpdateEmptyItem')
        }
        for (const key in update.item) {
            if (update.item.hasOwnProperty(key)) {
                const newName = `#${randomGenerator()}`
                const newValue = `:${randomGenerator()}`
                resolvedExpression += ` ${newName} = ${newValue},`
                expressionAttributeNames = { ...expressionAttributeNames, [newName]: key }
                expressionAttributeValues = Object.assign(
                    expressionAttributeValues,
                    marshalItem({ [newValue]: update.item[key] }),
                )
            }
        }
        resolvedExpression = resolvedExpression.slice(0, resolvedExpression.length - 1)
        return {
            schema: update.schema,
            key: update.key,
            updateExpression: {resolvedExpression, expressionAttributeNames, expressionAttributeValues },
        }
    }

    private buildUpdateWithImplicitKey(update: UpdateWithImplicitKey<Entity, KeySchema>): Update<KeySchema> {
        const tableSchema = update.schema.tableSchema!
        let resolvedExpression = 'SET'
        let expressionAttributeNames = {}
        let expressionAttributeValues = {}
        if (!Object.keys(update.item).length) {
            throw new Error('UpdateEmptyItem')
        }
        for (const prop in update.item) {
            if (update.item.hasOwnProperty(prop)
            && tableSchema.partitionKey !== prop && tableSchema.sortKey !== prop) {
                const newName = `#${randomGenerator()}`
                const newValue = `:${randomGenerator()}`
                resolvedExpression += ` ${newName} = ${newValue},`
                expressionAttributeNames = { ...expressionAttributeNames, [newName]: prop }
                expressionAttributeValues = Object.assign(
                    expressionAttributeValues,
                    marshalItem({ [newValue]: update.item[prop] }),
                )
            }
        }
        resolvedExpression = resolvedExpression.slice(0, resolvedExpression.length - 1)
        const key = {
            [tableSchema.partitionKey]: update.item[tableSchema.partitionKey],
        }
        if (tableSchema.sortKey) {
            key[tableSchema.sortKey] = update.item[tableSchema.sortKey]
        }
        return {
            schema: update.schema,
            key,
            updateExpression: { resolvedExpression, expressionAttributeNames, expressionAttributeValues },
        } as any
    }
}
