// import { Chaining, CommonFilter, Filter } from '../../common'
// import { QueryChaining } from './'
// import { DynamoQueryAllResults } from './all-results'
// import { DynamoQueryPaginate } from './paginate'
// import { DynamoQueryWithAttributes } from './with-attributes'
// import { DynamoQueryWithOptions, WithOptions } from './with-options'
//
// export class DynamoQueryFilter<
//     Model,
//     KeySchema
// > extends CommonFilter<QueryChaining> {
//
//     constructor(
//         filter: Filter,
//         currentStack: Array<Chaining<QueryChaining>>,
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
//         return new DynamoQueryPaginate<Model, KeySchema>(this._stack, { limit, lastKey})
//     }
//
//     public allResults() {
//         return new DynamoQueryAllResults<Model, KeySchema>(this._stack)
//     }
//
// }
