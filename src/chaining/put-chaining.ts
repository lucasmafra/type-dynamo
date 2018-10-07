import { Put } from '../operations/put'
import { IPutInput, IPutResult } from '../types'

export class PutChaining<Model> {
  public constructor(
    private putOperation: Put,
    private input: IPutInput<Model>,
  ) { }

  public async execute(): Promise<IPutResult<Model>> {
    return this.putOperation.execute(this.input)
  }
}
