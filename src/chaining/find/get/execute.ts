import { Get, IGetResult } from '../../../database-operations/get'
import { Chaining, WithAttributes } from '../../common'
import { GetChainingKind } from './'
import { IGetInput as IGet } from './get'

export class Executor<Model, KeySchema> {
  public get: Get<Model, KeySchema>

  public constructor(get: Get<Model, KeySchema>) {
    this.get = get
  }

  public execute(
    stack: Array<Chaining<GetChainingKind>>,
  ): Promise<IGetResult<Model, KeySchema>> {
    const { getInput, withAttributes } = this.extractFromStack(stack)
    return this.get.execute(getInput, { withAttributes })
  }

  private extractFromStack(stack: Array<Chaining<GetChainingKind>>): {
    getInput: IGet<KeySchema>,
    withAttributes?: WithAttributes,
  } {
    const getInput = (stack[0] as any)._get
    let withAttributes: WithAttributes | undefined
    for (const current of stack) {
      switch ((current as any)._kind) {
        case 'withAttributes':
          withAttributes = (current as any)._withAttributes
      }
    }
    return { getInput, withAttributes }
  }
}
