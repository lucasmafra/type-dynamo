import { Get } from '../../../operations/get'
import { GetChainingType, IGetInput, IGetResult } from '../../../types'
import { Chaining } from '../../chaining'
import { GetChainingWithAttributes } from './get-chaining-with-attributes'

export class GetChaining<Model,
  KeySchema> extends Chaining<GetChainingType> {

  constructor(
    private getOperation: Get,
    input: IGetInput<KeySchema>,
  ) {
    super('get', input)
  }

  public withAttributes<K extends keyof Model>(attributes: K[]) {
    return new GetChainingWithAttributes<Pick<Model, K>, KeySchema>(
      this.getOperation, attributes, this.stack,
    )
  }

  public execute(): Promise<IGetResult<Model, KeySchema>> {
    const { get: input } = this.extractFromStack()
    return this.getOperation.execute(input)
  }
}
