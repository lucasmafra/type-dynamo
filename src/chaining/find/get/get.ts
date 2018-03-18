import { GetResult} from '../../../database-operations/get'
import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import { GetChainingKind } from './'
import { execute } from './execute'
import { DynamoGetWithAttributes } from './with-attributes'

export type GetType = 'get'

export interface Get<KeySchema> {
    schema: EntitySchema,
    key: KeySchema,
}

export class DynamoGet<
    Entity,
    KeySchema
> extends Chaining<GetChainingKind> {

    protected _get: Get<KeySchema>

    constructor(
        get: Get<KeySchema>,
    ) {
        super('get')
        this._get = get
        this._stack.push(this)
    }

    public withAttributes<K extends keyof Entity>(attributes: K[]) {
        return new DynamoGetWithAttributes<Pick<Entity, K>, KeySchema>(
            attributes, this._stack,
        )
    }

    public execute() {
        return execute<Entity, KeySchema>(this._stack)
    }

}
