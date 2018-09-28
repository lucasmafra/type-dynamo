// import Expression from '../../../expressions/expression'
// import { Chaining, CommonFilter, Filter } from '../../common'
// import { ScanChainingType } from './'
// import { ScanChainingAllResults } from './all-results'
// import { ScanChainingPaginate } from './paginate'
// import { ScanChainingWithAttributes } from './with-attributes'
//
// export class DynamoScanFilter<
//     Entity,
//     KeySchema
// > extends CommonFilter<ScanChainingType> {
//
//     constructor(
//         filter: Filter,
//         currentStack: Array<Chaining<ScanChainingType>>,
//     ) {
//         super(filter, currentStack)
//     }
//
//     public withAttributes<K extends keyof Entity>(attributes: K[]) {
//         return new ScanChainingWithAttributes<Pick<Entity, K>, KeySchema>(
//             attributes, this._stack,
//         )
//     }
//
//     public paginate(limit?: number, lastKey?: KeySchema) {
//         return new ScanChainingPaginate<Entity, KeySchema>(this._stack, { limit, lastKey})
//     }
//
//     public allResults() {
//         return new ScanChainingAllResults<Entity, KeySchema>(this._stack)
//     }
//
// }
