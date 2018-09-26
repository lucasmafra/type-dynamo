import DynamoClient from '../../../database-operations/dynamo-client'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { QueryChaining } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryPaginate } from './paginate'

export class DynamoQueryWithAttributes<
  Model, KeySchema, PartitionKey
  > extends Chaining<QueryChaining> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    attributes: string[],
    currentStack: Array<Chaining<QueryChaining>>,
  ) {
    super('withAttributes', dynamoClient, helpers, attributes, currentStack)
  }

  // public withOptions(options: WithOptions) {
  //   // return new DynamoQueryWithOptions<
  // Model, KeySchema
  // >(this._stack, options)
  // }

  public paginate(limit?: number, lastKey?: KeySchema) {
    return new DynamoQueryPaginate<Model, KeySchema, PartitionKey>(
      this.dynamoClient,
      this.helpers,
      { limit,  lastKey },
      this.stack,
    )
  }

  public allResults() {
    return new DynamoQueryAllResults<Model, KeySchema, PartitionKey>(
      this.dynamoClient,
      this.helpers,
      this.stack,
    )
  }

}
