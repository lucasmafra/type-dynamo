import DynamoClient from '../../../operations/dynamo-client'
import { Scan } from '../../../operations/scan'
import { IHelpers, IScanResult, ScanChainingType } from '../../../types'
import { Chaining } from '../../chaining'

export class ScanChainingAllResults<Model,
  KeySchema> extends Chaining<ScanChainingType> {
  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    currentStack: Array<Chaining<ScanChainingType>>,
  ) {
    super('allResults', dynamoClient, helpers, {}, currentStack)
  }

  public execute(): Promise<IScanResult<Model, KeySchema>> {
    const { scan, withAttributes } = this.extractFromStack()
    return new Scan<Model, KeySchema>(this.dynamoClient, this.helpers)
      .execute({ ...scan, withAttributes, allResults: true })
  }
}
