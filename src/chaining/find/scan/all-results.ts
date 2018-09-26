import DynamoClient from '../../../database-operations/dynamo-client'
import { IScanResult, Scan } from '../../../database-operations/scan'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { ScanChaining } from './'

export class DynamoScanAllResults<Model,
  KeySchema> extends Chaining<ScanChaining> {
  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    currentStack: Array<Chaining<ScanChaining>>,
  ) {
    super('allResults', dynamoClient, helpers, {}, currentStack)
  }

  public execute(): Promise<IScanResult<Model, KeySchema>> {
    const { scan, withAttributes } = this.extractFromStack()
    return new Scan<Model, KeySchema>(this.dynamoClient, this.helpers)
      .execute({ ...scan, withAttributes, allResults: true })
  }
}
