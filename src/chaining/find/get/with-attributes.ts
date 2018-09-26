import DynamoClient from '../../../database-operations/dynamo-client'
import { Get, IGetResult } from '../../../database-operations/get'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { GetChaining } from './'

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
