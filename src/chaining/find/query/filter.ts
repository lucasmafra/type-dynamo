// import { Chaining, CommonFilter, Filter } from '../../common'
// import { QueryChainingType } from './'
// import { QueryChainingAllResults } from './all-results'
// import { QueryChainingPaginate } from './paginate'
// import { DynamoQueryWithAttributes } from './with-attributes'
// import { DynamoQueryWithOptions, WithOptions } from './with-options'
//
// export class DynamoQueryFilter<
//     Model,
//     KeySchema
// > extends CommonFilter<QueryChainingType> {
//
//     constructor(
//         filter: Filter,
//         currentStack: Array<Chaining<QueryChainingType>>,
//     ) {
//         super(filter, currentStack)
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
//         return new QueryChainingPaginate<Model, KeySchema>(this._stack, { limit, lastKey})
//     }
//
//     public allResults() {
//         return new QueryChainingAllResults<Model, KeySchema>(this._stack)
//     }
//
// }
