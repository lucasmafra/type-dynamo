import DynamoClient from '../../../database-operations/dynamo-client'
import { IQueryResult, Query } from '../../../database-operations/query'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { QueryChaining } from './'

export class DynamoQueryAllResults<
  Model,
  KeySchema,
  PartitionKey
> extends Chaining<QueryChaining> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    currentStack: Array<Chaining<QueryChaining>>,
  ) {
    super('allResults', dynamoClient, helpers, {}, currentStack)
  }

  public execute(): Promise<IQueryResult<Model, KeySchema>> {
    const {query, withAttributes} = this.extractFromStack()
    return new Query<Model, KeySchema, PartitionKey>(
      this.dynamoClient, this.helpers,
    ).execute({...query, withAttributes, allResults: true})
  }
}
