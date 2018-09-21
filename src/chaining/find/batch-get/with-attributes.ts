import { BatchGet, IBatchGetResult } from '../../../database-operations'
import DynamoClient from '../../../database-operations/dynamo-client'
import { Chaining } from '../../common'
import { BatchGetChaining } from './'

export class DynamoBatchGetWithAttributes<Model,
  KeySchema> extends Chaining<BatchGetChaining> {

  constructor(
    attributes: string[],
    dynamoClient: DynamoClient,
    currentStack: Array<Chaining<BatchGetChaining>>,
  ) {
    super('withAttributes', dynamoClient, currentStack, attributes)
  }

  public execute(): Promise<IBatchGetResult<Model>> {
    const {batchGet, withAttributes} = this.extractFromStack()
    return new BatchGet<Model, KeySchema>(this.dynamoClient).execute(
      batchGet, {withAttributes},
    )
  }
}
