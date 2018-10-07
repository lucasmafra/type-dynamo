import { BatchWrite } from '../operations/batch-write'
import { IBatchWriteInput, IBatchWriteResult } from '../types'

export class BatchWriteChaining<Model> {
  public constructor(
    private batchWriteOperation: BatchWrite,
    private input: IBatchWriteInput<Model>,
  ) { }

  public execute(): Promise<IBatchWriteResult<Model>> {
    return this.batchWriteOperation.execute(this.input)
  }
}
