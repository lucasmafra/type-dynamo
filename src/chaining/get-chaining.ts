import { Get } from '../operations/get'
import { IGetInput, IGetResult, Omit } from '../types'

/*
  MyRepository
    .find(key: KeySchema)
    .withAttributes(attributes: string[]) // optional
    .execute()
*/
export class GetChaining<Model, KeySchema> {
  constructor(
    private getOperation: Get, private input: IGetInput<KeySchema>,
  ) { }

  public withAttributes<K extends keyof Model>(
    attributes: K[],
  ): Omit<GetChaining<Model, KeySchema>, 'withAttributes'> {
    this.input = { ...this.input, withAttributes: attributes }
    return this
  }

  public execute(): Promise<IGetResult<Model, KeySchema>> {
    return this.getOperation.execute(this.input)
  }
}
