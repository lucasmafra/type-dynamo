import { BatchGet } from '../../../operations/batch-get'
import DynamoClient from '../../../operations/dynamo-client'
import { BatchGetChaining, IBatchGetResult, IHelpers } from '../../../types'
import { Chaining } from '../../chaining'

export class DynamoBatchGetWithAttributes<Model,
  KeySchema> extends Chaining<BatchGetChaining> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    attributes: string[],
    currentStack: Array<Chaining<BatchGetChaining>>,
  ) {
    super('withAttributes', dynamoClient, helpers, attributes, currentStack)
  }

  public execute(): Promise<IBatchGetResult<Model>> {
    const {batchGet, withAttributes} = this.extractFromStack()
    return new BatchGet<Model, KeySchema>(this.dynamoClient, this.helpers)
      .execute({ ...batchGet, withAttributes },
    )
  }
}
