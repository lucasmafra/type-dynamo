import DynamoClient from '../../../operations/dynamo-client'
import { IHelpers, IQueryInput, QueryChainingType } from '../../../types'
import { Chaining } from '../../chaining'
import { QueryChainingAllResults } from './all-results'
import { QueryChainingPaginate } from './paginate'
import { DynamoQueryWithAttributes } from './with-attributes'

export class QueryChaining<Model, PartitionKey, SortKey, KeySchema>
  extends Chaining<QueryChainingType> {
  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input: IQueryInput<KeySchema, PartitionKey>,
  ) {
    super('query', dynamoClient, helpers, input)
  }

  public withSortKeyCondition(operator: any) {
    // return new DynamoWithSortKeyCondition<
    // Model, KeySchema
    // >(this._query.schema, operator, this._stack)
  }

  // public filter(filterExpression: Expression) {
  //   // return new DynamoQueryFilter<
  //   // Model, KeySchema
  //   // >({filterExpression}, this._stack)
  // }

  public withAttributes<K extends keyof Model>(attributes: K[]) {
    return new DynamoQueryWithAttributes<
      Pick<Model, K>, KeySchema, PartitionKey
    >(
      this.dynamoClient,
      this.helpers,
      attributes,
      this.stack,
    )
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
      { limit, lastKey },
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
