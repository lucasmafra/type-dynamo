import DynamoClient from '../../../database-operations/dynamo-client'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { ScanChaining } from './'
import { DynamoScanAllResults } from './all-results'
import { DynamoScanPaginate } from './paginate'

export class DynamoScanWithAttributes<
  Model,
  KeySchema
> extends Chaining<ScanChaining> {
  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    attributes: string[],
    currentStack: Array<Chaining<ScanChaining>>,
  ) {
    super('withAttributes', dynamoClient, helpers, attributes, currentStack)
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
