import DynamoClient from '../../../operations/dynamo-client'
import { Get } from '../../../operations/get'
import {
  GetChainingType, IGetInput, IGetResult, IHelpers,
} from '../../../types'
import { Chaining } from '../../chaining'
import { GetChainingWithAttributes } from './with-attributes'

export class GetChaining<Entity,
  KeySchema> extends Chaining<GetChainingType> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input: IGetInput<KeySchema>,
  ) {
    super('get', dynamoClient, helpers, input)
  }

  public withAttributes<K extends keyof Entity>(attributes: K[]) {
    return new GetChainingWithAttributes<Pick<Entity, K>, KeySchema>(
      this.dynamoClient, this.helpers, attributes, this.stack,
    )
  }

  public execute(): Promise<IGetResult<Entity, KeySchema>> {
    const { get } = this.extractFromStack()
    return new Get<Entity, KeySchema>(this.dynamoClient, this.helpers)
      .execute(get)
  }
}
