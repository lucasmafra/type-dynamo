import {
  BatchGet,
  IBatchGetInput,
  IBatchGetResult,
} from '../../../database-operations'
import DynamoClient from '../../../database-operations/dynamo-client'
import { Chaining } from '../../common'
import { BatchGetChaining } from './'
import { DynamoBatchGetWithAttributes } from './with-attributes'

export class DynamoBatchGet<Model,
  KeySchema> extends Chaining<BatchGetChaining> {

  constructor(
    input: IBatchGetInput<KeySchema>,
    dynamoClient: DynamoClient,
  ) {
    super('batchGet', dynamoClient, [], input)
  }

  public withAttributes<K extends keyof Model>(attributes: K[]) {
    return new DynamoBatchGetWithAttributes<Pick<Model, K>, KeySchema>(
      attributes, this.stack,
    )
  }

  public execute(): Promise<IBatchGetResult<Model>> {
    const { batchGet } = this.extractFromStack()
    return new BatchGet<Model, KeySchema>(this.dynamoClient).execute(batchGet)
  }
}
