import { Query } from '../operations/query'
import { IQueryInput, IQueryResult, Omit } from '../types'

/*
  MyRepository
    .find(key: PartitionKey)
    .withSortKeyCondition(operator: any) // optional
    .filter(filterExpression: any) // optional
    .withAttributes(attributes: string[]) // optional
    .withOptions(options: any) // optional
    .paginate(limit?: number, lastKey?: KeySchema) // or allResults()
    .execute()
*/

export class QueryChaining<Model, PartitionKey, SortKey, KeySchema> {
  constructor(
    private queryOperation: Query,
    private input: IQueryInput<KeySchema, PartitionKey>,
  ) {
  }

  public withSortKeyCondition(
    operator: any,
  ): Omit<QueryChaining<Model, PartitionKey, SortKey, KeySchema>,
    'withSortKeyCondition'> {
    // TODO
    return this
  }

  public filter(
    filterExpression: any,
  ): Omit<QueryChaining<Model, PartitionKey, SortKey, KeySchema>, 'filter'> {
    // TODO
    return this
  }

  public withAttributes<K extends keyof Model>(
    attributes: K[],
  ): Omit<QueryChaining<Model, PartitionKey, SortKey, KeySchema>,
    'withAttributes'> {
    this.input = {...this.input, withAttributes: attributes}
    return this
  }

  public withOptions(
    options: any,
  ): Omit<QueryChaining<Model, PartitionKey, SortKey, KeySchema>,
    'withOptions'> {
    // TODO
    return this
  }

  public paginate(
    limit?: number, lastKey?: KeySchema,
  ): Omit<QueryChaining<Model, PartitionKey, SortKey, KeySchema>,
    'paginate' | 'allResults'> {
    this.input = { ...this.input, paginate: { limit, lastKey }}
    return this
  }

  public allResults(): Omit<
    QueryChaining<Model, PartitionKey, SortKey, KeySchema>,
    'paginate' | 'allResults'> {
    this.input = { ...this.input, allResults: true }
    return this
  }

  public execute(): Promise<IQueryResult<Model, KeySchema>> {
    return this.queryOperation.execute(this.input)
  }
}
