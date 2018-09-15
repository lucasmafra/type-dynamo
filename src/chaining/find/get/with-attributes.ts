import { Get, IGetResult } from '../../../database-operations/get'
import { Chaining, CommonWithAttributes } from '../../common'
import { GetChainingKind } from './'
import { Executor } from './execute'

export class DynamoGetWithAttributes<Entity,
  KeySchema> extends CommonWithAttributes<GetChainingKind> {

  constructor(
    attributes: string[],
    currentStack: Array<Chaining<GetChainingKind>>,
  ) {
    super(attributes, currentStack)
  }

  public execute(): Promise<IGetResult<Entity, KeySchema>> {
    const get = new Get<Entity, KeySchema>()
    return new Executor<Entity, KeySchema>(get).execute(this._stack)
  }
}
