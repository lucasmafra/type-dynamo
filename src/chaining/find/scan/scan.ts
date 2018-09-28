import DynamoClient from '../../../operations/dynamo-client'
import { IHelpers, IScanInput, ScanChainingType } from '../../../types'
import { Chaining } from '../../chaining'
import { ScanChainingAllResults } from './all-results'
import { ScanChainingPaginate } from './paginate'
import { ScanChainingWithAttributes } from './with-attributes'

export class ScanChaining<
  Model,
  KeySchema
> extends Chaining<ScanChainingType> {
  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input: IScanInput<KeySchema>,
  ) {
    super('scan', dynamoClient, helpers, input)
  }

  // public filter(filterExpression: Expression) {
  //     return new DynamoScanFilter<
  // Model, KeySchema
  // >({filterExpression}, this._stack)
  // }

  public withAttributes<K extends keyof Model>(attributes: K[]) {
    return new ScanChainingWithAttributes<Pick<Model, K>, KeySchema>(
      this.dynamoClient,
      this.helpers,
      attributes,
      this.stack,
    )
  }

  public paginate(limit?: number, lastKey?: KeySchema) {
    return new ScanChainingPaginate<Model, KeySchema>(
      this.dynamoClient,
      this.helpers,
      { limit, lastKey },
      this.stack,
    )
  }

  public allResults() {
    return new ScanChainingAllResults<Model, KeySchema>(
      this.dynamoClient,
      this.helpers,
      this.stack,
    )
  }
}
