// import Expression from '../../../expressions/expression'
// import {
//     BeginsWith, IsBetween, IsEqualTo, IsGreaterOrEqualTo, IsGreaterThan, IsLessOrEqualTo, IsLessThan,
//     Operator,
//  } from '../../../expressions/operator'
// import { IExpressionAttributeNames } from '../../../helpers/expression-attribute-names-generator'
// import { randomGenerator } from '../../../helpers/random-generator'
// import { IEntitySchema } from '../../../schema'
// import { Chaining } from '../../common'
// import { QueryChaining } from './'
// import { DynamoQueryAllResults } from './all-results'
// import { DynamoQueryFilter } from './filter'
// import { DynamoQueryPaginate } from './paginate'
// import { DynamoQueryWithAttributes } from './with-attributes'
// import { DynamoQueryWithOptions, WithOptions } from './with-options'
//
// export type WithSortKeyConditionType = 'withSortKeyCondition'
//
// export class DynamoWithSortKeyCondition<
//     Model,
//     KeySchema
// > extends Chaining<QueryChaining> {
//
//     private _withSortKeyCondition: IWithSortKeyCondition
//
//     constructor(
//         schema: IEntitySchema,
//         operator: SortKeyConditionOperator,
//         currentStack: Array<Chaining<QueryChaining>>,
//     ) {
//         super('withSortKeyCondition', currentStack)
//         this._withSortKeyCondition = this.buildSortKeyCondition(schema, operator)
//         this._stack.push(this)
//     }
//
//     public filter(filterExpression: Expression) {
//         return new DynamoQueryFilter<Model, KeySchema>( {filterExpression }, this._stack)
//     }
//
//     public withAttributes<K extends keyof Model>(attributes: K[]) {
//         return new DynamoQueryWithAttributes<Pick<Model, K>, KeySchema>(
//             attributes, this._stack,
//         )
//     }
//
//     public withOptions(options: WithOptions) {
//         return new DynamoQueryWithOptions<Model, KeySchema>(this._stack, options)
//     }
//
//     public paginate(limit?: number, lastKey?: KeySchema) {
//         return new DynamoQueryPaginate<Model, KeySchema>(this._stack, { limit, lastKey})
//     }
//
//     public allResults() {
//         return new DynamoQueryAllResults<Model, KeySchema>(this._stack)
//     }
//
//     private buildSortKeyCondition(schema: IEntitySchema, sortKeyConditionOperator: SortKeyConditionOperator) {
//         let expression: string
//         const sortKey = schema.tableSchema ? schema.tableSchema.sortKey! : schema.indexSchema!.sortKey!
//         const randomId = '#' + randomGenerator()
//         if (sortKeyConditionOperator.type === 'function') {
//             expression = sortKeyConditionOperator.value +
//                 `(${randomId},${sortKeyConditionOperator.functionOperand})`
//         } else {
//             expression = randomId + ' ' + sortKeyConditionOperator.value
//         }
//         const expressionAttributeNames = {
//             [randomId]: sortKey,
//         }
//         const expressionAttributeValues = sortKeyConditionOperator.expressionAttributeValues
//         return { expression, expressionAttributeNames, expressionAttributeValues }
//     }
//
// }
