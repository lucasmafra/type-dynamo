import DynamoClient from '../../../operations/dynamo-client'
import { Get } from '../../../operations/get'
import { GetChaining, IGetInput, IGetResult, IHelpers } from '../../../types'
import { Chaining } from '../../chaining'
import { DynamoGetWithAttributes } from './with-attributes'

export class DynamoGet<Entity,
  KeySchema> extends Chaining<GetChaining> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input: IGetInput<KeySchema>,
  ) {
    super('get', dynamoClient, helpers, input)
  }

  public withAttributes<K extends keyof Entity>(attributes: K[]) {
    return new DynamoGetWithAttributes<Pick<Entity, K>, KeySchema>(
      this.dynamoClient, this.helpers, attributes, this.stack,
    )
  }

  public execute(): Promise<IGetResult<Entity, KeySchema>> {
    const { get } = this.extractFromStack()
    return new Get<Entity, KeySchema>(this.dynamoClient, this.helpers)
      .execute(get)
  }
}
