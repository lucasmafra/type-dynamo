import Expression from '../../../expressions/expression'
import { EntitySchema } from '../../../schema'
import { Chaining, CommonAllResults } from '../../common'
import { ScanChainingKind } from './'
import { executeAllResults } from './execute'

export class DynamoScanAllResults<
    Entity,
    KeySchema
> extends CommonAllResults<ScanChainingKind> {

    constructor(
        currentStack: Array<Chaining<ScanChainingKind>>,
    ) {
        super(currentStack)
    }

    public execute() {
        return executeAllResults<Entity, KeySchema>(this._stack)
    }

}
