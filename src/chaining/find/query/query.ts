import DynamoClient from '../../../database-operations/dynamo-client'
import { IQueryInput } from '../../../database-operations/query'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { QueryChaining } from './'
import { DynamoQueryAllResults } from './all-results'
import { DynamoQueryPaginate } from './paginate'
import { DynamoQueryWithAttributes } from './with-attributes'

export class DynamoQuery<Model,
  PartitionKey,
  SortKey,
  KeySchema
> extends Chaining<QueryChaining> {
  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input: IQueryInput<KeySchema, PartitionKey>,
  ) {
    super('query', dynamoClient, helpers, input)
  }

  // public withSortKeyCondition(operator: SortKeyConditionOperator) {
  //   // return new DynamoWithSortKeyCondition<
  //   // Model, KeySchema
  //   // >(this._query.schema, operator, this._stack)
  // }

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
    return new DynamoQueryPaginate<Model, KeySchema, PartitionKey>(
      this.dynamoClient,
      this.helpers,
      { limit, lastKey },
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
