import { BatchGet } from '../../../operations/batch-get'
import DynamoClient from '../../../operations/dynamo-client'
import {
  BatchGetChaining,
  IBatchGetInput,
  IBatchGetResult,
  IHelpers,
} from '../../../types'
import { Chaining } from '../../chaining'
import { DynamoBatchGetWithAttributes } from './with-attributes'

export class DynamoBatchGet<Model,
  KeySchema> extends Chaining<BatchGetChaining> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input: IBatchGetInput<KeySchema>,
  ) {
    super('batchGet', dynamoClient, helpers, input)
  }

  public withAttributes<K extends keyof Model>(attributes: K[]) {
    return new DynamoBatchGetWithAttributes<Pick<Model, K>, KeySchema>(
      this.dynamoClient, this.helpers, attributes, this.stack,
    )
  }

  public execute(): Promise<IBatchGetResult<Model>> {
    const { batchGet } = this.extractFromStack()
    return new BatchGet<Model, KeySchema>(this.dynamoClient, this.helpers)
      .execute(batchGet)
  }
}
