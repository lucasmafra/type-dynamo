import DynamoClient from '../../../operations/dynamo-client'
import { IHelpers, ScanChainingType } from '../../../types'
import { Chaining } from '../../chaining'
import { ScanChainingAllResults } from './all-results'
import { ScanChainingPaginate } from './paginate'

export class ScanChainingWithAttributes<
  Model,
  KeySchema
> extends Chaining<ScanChainingType> {
  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    attributes: string[],
    currentStack: Array<Chaining<ScanChainingType>>,
  ) {
    super('withAttributes', dynamoClient, helpers, attributes, currentStack)
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
