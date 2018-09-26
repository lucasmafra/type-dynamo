import DynamoClient from '../../../database-operations/dynamo-client'
import { IQueryResult, Query } from '../../../database-operations/query'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { QueryChaining } from './'

export class DynamoQueryPaginate<
  Model, KeySchema, PartitionKey
> extends Chaining<QueryChaining> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    paginate: { limit?: number, lastKey?: KeySchema },
    currentStack: Array<Chaining<QueryChaining>>,
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
