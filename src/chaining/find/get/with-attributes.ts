import DynamoClient from '../../../operations/dynamo-client'
import { Get } from '../../../operations/get'
import { GetChaining, IGetResult, IHelpers } from '../../../types'
import { Chaining } from '../../chaining'

export class DynamoGetWithAttributes<Entity, KeySchema>
  extends Chaining<GetChaining> {

  protected withAttributes: string[]

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    attributes: string[],
    currentStack: Array<Chaining<GetChaining>>,
  ) {
    super('withAttributes', dynamoClient, helpers, attributes, currentStack)
  }

  public execute(): Promise<IGetResult<Entity, KeySchema>> {
    const { get, withAttributes } = this.extractFromStack()
    return new Get<Entity, KeySchema>(this.dynamoClient, this.helpers)
      .execute({ ...get, ...withAttributes })
  }
}
