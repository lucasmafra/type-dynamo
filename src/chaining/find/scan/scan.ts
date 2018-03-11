import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import Expression from '../../expressions/Expression'
import { ScanChainingKind } from './'
import { DynamoScanAllResults } from './all-results'
import { DynamoScanFilter } from './filter'
import { DynamoScanPaginate } from './paginate'
import { DynamoScanWithAttributes } from './with-attributes'

export type ScanType = 'scan'

export class DynamoScan<
    Entity,
    KeySchema
> extends Chaining<ScanChainingKind> {

    protected _schema: EntitySchema

    constructor(
        schema: EntitySchema,
    ) {
        super('scan')
        this._schema = schema
        this._stack.push(this)
    }

    public filter(filterExpression: Expression) {
        return new DynamoScanFilter<Entity, KeySchema>(filterExpression, this._stack)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return new DynamoScanWithAttributes<Pick<Entity, K>, KeySchema>(
            attributes, this._stack,
        )
    }

    public paginate(limit?: number, lastKey?: KeySchema) {
        return new DynamoScanPaginate<Entity, KeySchema>(this._stack, { limit, lastKey})
    }

    public allResults() {
        return new DynamoScanAllResults<Entity, KeySchema>(this._stack)
    }

}
