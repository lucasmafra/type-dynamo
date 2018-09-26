import DynamoClient from '../../../database-operations/dynamo-client'
import { IScanInput } from '../../../database-operations/scan'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { ScanChaining } from './'
import { DynamoScanAllResults } from './all-results'
import { DynamoScanPaginate } from './paginate'
import { DynamoScanWithAttributes } from './with-attributes'

export class DynamoScan<
  Model,
  KeySchema
> extends Chaining<ScanChaining> {
  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input: IScanInput<KeySchema>,
  ) {
    super('scan', dynamoClient, helpers, input)
  }

  // public filter(filterExpression: Expression) {
  //     return new DynamoScanFilter<
  // Entity, KeySchema
  // >({filterExpression}, this._stack)
  // }

  public withAttributes<K extends keyof Model>(attributes: K[]) {
    return new DynamoScanWithAttributes<Pick<Model, K>, KeySchema>(
      this.dynamoClient,
      this.helpers,
      attributes,
      this.stack,
    )
  }

  public paginate(limit?: number, lastKey?: KeySchema) {
    return new DynamoScanPaginate<Model, KeySchema>(
      this.dynamoClient,
      this.helpers,
      { limit, lastKey },
      this.stack,
    )
  }

  public allResults() {
    return new DynamoScanAllResults<Model, KeySchema>(
      this.dynamoClient,
      this.helpers,
      this.stack,
    )
  }
}
