import DynamoClient from '../../../operations/dynamo-client'
import {  Query } from '../../../operations/query'
import { IHelpers, IQueryResult, QueryChainingType } from '../../../types'
import { Chaining } from '../../chaining'

export class QueryChainingAllResults<
  Model,
  KeySchema,
  PartitionKey
> extends Chaining<QueryChainingType> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    currentStack: Array<Chaining<QueryChainingType>>,
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
