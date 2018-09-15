import { Get, IGetResult } from '../../../database-operations/get'
import { EntitySchema } from '../../../schema'
import { Chaining } from '../../common'
import { GetChainingKind } from './'
import { Executor } from './execute'
import { DynamoGetWithAttributes } from './with-attributes'

export type GetType = 'get'

export interface IGetInput<KeySchema> {
  schema: EntitySchema,
  key: KeySchema,
}

export class DynamoGet<Entity,
  KeySchema> extends Chaining<GetChainingKind> {

  protected _get: IGetInput<KeySchema>

  constructor(
    get: IGetInput<KeySchema>,
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

  public execute(): Promise<IGetResult<Entity, KeySchema>> {
    const get = new Get<Entity, KeySchema>()
    return new Executor<Entity, KeySchema>(get).execute(this._stack)
  }
}
