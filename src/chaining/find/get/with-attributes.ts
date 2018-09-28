import DynamoClient from '../../../operations/dynamo-client'
import { Get } from '../../../operations/get'
import { GetChainingType, IGetResult, IHelpers } from '../../../types'
import { Chaining } from '../../chaining'

export class GetChainingWithAttributes<Entity, KeySchema>
  extends Chaining<GetChainingType> {

  protected withAttributes: string[]

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    attributes: string[],
    currentStack: Array<Chaining<GetChainingType>>,
  ) {
    super('withAttributes', dynamoClient, helpers, attributes, currentStack)
  }

  public execute(): Promise<IGetResult<Entity, KeySchema>> {
    const { get, withAttributes } = this.extractFromStack()
    return new Get<Entity, KeySchema>(this.dynamoClient, this.helpers)
      .execute({ ...get, ...withAttributes })
  }
}
