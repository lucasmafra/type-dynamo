import { Get, IGetInput, IGetResult } from '../../../database-operations'
import { Chaining } from '../../common'
import { GetChaining } from './index'
import { DynamoGetWithAttributes } from './with-attributes'

export class DynamoGet<Entity,
  KeySchema> extends Chaining<GetChaining> {

  constructor(input: IGetInput<KeySchema>) {
    super('get', [], input)
  }

  public withAttributes<K extends keyof Entity>(attributes: K[]) {
    return new DynamoGetWithAttributes<Pick<Entity, K>, KeySchema>(
      attributes, this.stack,
    )
  }

  public execute(): Promise<IGetResult<Entity, KeySchema>> {
    const { get } = this.extractFromStack()
    return new Get<Entity, KeySchema>().execute(get)
  }
}
