import { Omit } from '../..'
import { Scan } from '../../operations/scan'
import { IScanInput, IScanResult } from '../../types'

export class ScanChaining<Model, KeySchema> {
  constructor(
    private scanOperation: Scan,
    private input: IScanInput<KeySchema>,
  ) { }

  public filter(filterExpression: any) {
    // TODO
    return this
  }

  public withAttributes<K extends keyof Model>(
    attributes: K[],
  ): Omit<ScanChaining<Model, KeySchema>, 'withAttributes'> {
    this.input = { ...this.input, withAttributes: attributes }
    return this
  }

  public paginate(
    limit?: number, lastKey?: KeySchema,
  ): Omit<ScanChaining<Model, KeySchema>, 'paginate' | 'allResults'> {
    this.input = { ...this.input, paginate: { limit, lastKey } }
    return this
  }

  public allResults(): Omit<ScanChaining<Model, KeySchema>,
    'paginate' | 'allResults'> {
    this.input = { ...this.input, allResults: true }
    return this
  }

  public execute(): Promise<IScanResult<Model, KeySchema>> {
    return this.scanOperation.execute(this.input)
  }
}
