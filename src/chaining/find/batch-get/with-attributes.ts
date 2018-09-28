import { BatchGet } from '../../../operations/batch-get'
import DynamoClient from '../../../operations/dynamo-client'
import { BatchGetChainingType, IBatchGetResult, IHelpers } from '../../../types'
import { Chaining } from '../../chaining'

export class BatchGetChainingWithAttributes<Model,
  KeySchema> extends Chaining<BatchGetChainingType> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    attributes: string[],
    currentStack: Array<Chaining<BatchGetChainingType>>,
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
