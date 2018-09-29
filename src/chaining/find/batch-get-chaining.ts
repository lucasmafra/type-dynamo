import { Omit } from '../..'
import { BatchGet } from '../../operations/batch-get'
import { IBatchGetInput, IBatchGetResult } from '../../types'

/*
  MyRepository
    .find(keys: KeySchema[])
    .withAttributes(attributes: string[]) // optional
    .execute()
*/
export class BatchGetChaining<Model, KeySchema> {
  constructor(
    private batchGetOperation: BatchGet,
    private input: IBatchGetInput<KeySchema>,
  ) { }

  public withAttributes<K extends keyof Model>(
    attributes: K[],
  ): Omit<BatchGetChaining<Model, KeySchema>, 'withAttributes'> {
    this.input = { ...this.input, withAttributes: attributes }
    return this
  }

  public execute(): Promise<IBatchGetResult<Model>> {
    return this.batchGetOperation.execute(this.input)
  }
}
