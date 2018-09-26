import {
  BatchGet, IBatchGetResult,
} from '../../../database-operations/batch-get'
import DynamoClient from '../../../database-operations/dynamo-client'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { BatchGetChaining } from './'

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
