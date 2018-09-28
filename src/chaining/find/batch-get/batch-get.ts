import { BatchGet } from '../../../operations/batch-get'
import DynamoClient from '../../../operations/dynamo-client'
import {
  BatchGetChainingType,
  IBatchGetInput,
  IBatchGetResult,
  IHelpers,
} from '../../../types'
import { Chaining } from '../../chaining'
import { BatchGetChainingWithAttributes } from './with-attributes'

export class BatchGetChaining<Model,
  KeySchema> extends Chaining<BatchGetChainingType> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input: IBatchGetInput<KeySchema>,
  ) {
    super('batchGet', dynamoClient, helpers, input)
  }

  public withAttributes<K extends keyof Model>(attributes: K[]) {
    return new BatchGetChainingWithAttributes<Pick<Model, K>, KeySchema>(
      this.dynamoClient, this.helpers, attributes, this.stack,
    )
  }

  public execute(): Promise<IBatchGetResult<Model>> {
    const { batchGet } = this.extractFromStack()
    return new BatchGet<Model, KeySchema>(this.dynamoClient, this.helpers)
      .execute(batchGet)
  }
}
