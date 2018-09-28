// import { randomGenerator } from '../../../helpers/random-generator'
// import { Chaining, CommonWithAttributes } from '../../common'
// import { QueryChainingType } from './'
// import { QueryChainingAllResults } from './all-results'
// import { QueryChainingPaginate } from './paginate'
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
// > extends Chaining<QueryChainingType> {
//
//     private _withOptions: WithOptions
//
//     constructor(
//         currentStack: Array<Chaining<QueryChainingType>>,
//         withOptions: WithOptions,
//     ) {
//         super('withOptions', currentStack)
//         this._withOptions = withOptions
//         this._stack.push(this)
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
