import DynamoClient from '../../../operations/dynamo-client'
import { Query } from '../../../operations/query'
import { IHelpers, IQueryResult, QueryChainingType } from '../../../types'
import { Chaining } from '../../chaining'

export class QueryChainingPaginate<
  Model, KeySchema, PartitionKey
> extends Chaining<QueryChainingType> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    paginate: { limit?: number, lastKey?: KeySchema },
    currentStack: Array<Chaining<QueryChainingType>>,
  ) {
    super('paginate', dynamoClient, helpers, paginate, currentStack)
  }

  public execute(): Promise<IQueryResult<Model, KeySchema>> {
    const {query, paginate, withAttributes} = this.extractFromStack()
    return new Query<Model, KeySchema, PartitionKey>(
      this.dynamoClient, this.helpers,
    ).execute({...query, withAttributes, paginate})
  }
}
