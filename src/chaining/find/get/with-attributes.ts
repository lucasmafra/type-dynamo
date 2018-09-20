import { Get, IGetResult } from '../../../database-operations/get'
import { Chaining } from '../../common'
import { GetChaining } from './'

export class DynamoGetWithAttributes<Entity, KeySchema>
  extends Chaining<GetChaining> {

  protected withAttributes: string[]

  constructor(
    attributes: string[],
    currentStack: Array<Chaining<GetChaining>>,
  ) {
    super('withAttributes', currentStack, attributes)
  }

  public execute(): Promise<IGetResult<Entity, KeySchema>> {
    const { get, withAttributes } = this.extractFromStack()
    return new Get<Entity, KeySchema>().execute(get, withAttributes)
  }
}
