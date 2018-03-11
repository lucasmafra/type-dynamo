import { EntitySchema } from '../../../schema'
import { Chaining, CommonAllResults } from '../../common'
import Expression from '../../expressions/Expression'
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
