import DynamoClient from '../../../operations/dynamo-client'
import { Scan } from '../../../operations/scan'
import { IHelpers, IScanResult, ScanChaining } from '../../../types'
import { Chaining } from '../../chaining'

export class DynamoScanPaginate<Model,
  KeySchema> extends Chaining<ScanChaining> {

  constructor(
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    paginate: { limit?: number, lastKey?: KeySchema },
    currentStack: Array<Chaining<ScanChaining>>,
  ) {
    super('paginate', dynamoClient, helpers, paginate, currentStack)
  }

  public execute(): Promise<IScanResult<Model, KeySchema>> {
    const { scan, withAttributes, paginate } = this.extractFromStack()
    return new Scan<Model, KeySchema>(this.dynamoClient, this.helpers)
      .execute({ ...scan, withAttributes, paginate })
  }
}
