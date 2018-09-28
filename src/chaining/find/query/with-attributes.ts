import DynamoClient from '../../../operations/dynamo-client'
import { IHelpers, QueryChainingType } from '../../../types'
import { Chaining } from '../../chaining'
import { QueryChainingAllResults } from './all-results'
import { QueryChainingPaginate } from './paginate'

export class DynamoQueryWithAttributes<
  Model, KeySchema, PartitionKey
  > extends Chaining<QueryChainingType> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    attributes: string[],
    currentStack: Array<Chaining<QueryChainingType>>,
  ) {
    super('withAttributes', dynamoClient, helpers, attributes, currentStack)
  }

  // public withOptions(options: WithOptions) {
  //   // return new DynamoQueryWithOptions<
  // Model, KeySchema
  // >(this._stack, options)
  // }

  public paginate(limit?: number, lastKey?: KeySchema) {
    return new QueryChainingPaginate<Model, KeySchema, PartitionKey>(
      this.dynamoClient,
      this.helpers,
      { limit,  lastKey },
      this.stack,
    )
  }

  public allResults() {
    return new QueryChainingAllResults<Model, KeySchema, PartitionKey>(
      this.dynamoClient,
      this.helpers,
      this.stack,
    )
  }
}
