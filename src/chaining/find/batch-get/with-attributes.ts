import { BatchGet, IBatchGetResult } from '../../../database-operations'
import { Chaining } from '../../common'
import { BatchGetChainingKind } from './'

export class DynamoBatchGetWithAttributes<Model,
  KeySchema> extends Chaining<BatchGetChainingKind> {

  constructor(
    attributes: string[],
    currentStack: Array<Chaining<BatchGetChainingKind>>,
  ) {
    super('withAttributes', currentStack, attributes)
  }

  public execute(): Promise<IBatchGetResult<Model>> {
    const {batchGet, withAttributes} = this.extractFromStack()
    return new BatchGet<Model, KeySchema>().execute(
      batchGet, {withAttributes},
    )
  }
}
