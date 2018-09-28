import { Get } from '../../../operations/get'
import { GetChainingType, IGetResult } from '../../../types'
import { Chaining } from '../../chaining'

export class GetChainingWithAttributes<Model, KeySchema>
  extends Chaining<GetChainingType> {

  protected withAttributes: string[]

  constructor(
    private get: Get,
    attributes: string[],
    currentStack: Array<Chaining<GetChainingType>>,
  ) {
    super('withAttributes', attributes, currentStack)
  }

  public execute(): Promise<IGetResult<Model, KeySchema>> {
    const { get: input, withAttributes } = this.extractFromStack()
    return this.get.execute({ ...input, withAttributes })
  }
}
