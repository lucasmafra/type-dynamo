import DynamoClient from '../../../database-operations/dynamo-client'
import { IScanResult, Scan } from '../../../database-operations/scan'
import { IHelpers } from '../../../helpers'
import { Chaining } from '../../chaining'
import { ScanChaining } from './'

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
