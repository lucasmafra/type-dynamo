// import { randomGenerator } from '../../../helpers/random-generator'
// import { Chaining, CommonWithAttributes } from '../../common'
// import { QueryChaining } from './'
// import { DynamoQueryAllResults } from './all-results'
// import { DynamoQueryPaginate } from './paginate'
//
// export type WithOptionsType = 'withOptions'
//
// export interface WithOptions {
//     order?: 'ascending' | 'descending'
// }
//
// export class DynamoQueryWithOptions<
//     Model,
//     KeySchema
// > extends Chaining<QueryChaining> {
//
//     private _withOptions: WithOptions
//
//     constructor(
//         currentStack: Array<Chaining<QueryChaining>>,
//         withOptions: WithOptions,
//     ) {
//         super('withOptions', currentStack)
//         this._withOptions = withOptions
//         this._stack.push(this)
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
