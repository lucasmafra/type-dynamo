import DynamoClient from '../operations/dynamo-client'
import { IHelpers } from '../types'

export abstract class Chaining<ChainingKind> {
  protected kind: ChainingKind
  protected stack: Array<Chaining<ChainingKind>>
  protected dynamoClient: DynamoClient
  protected helpers: IHelpers
  protected input?: any

  constructor(
    kind: ChainingKind,
    dynamoClient: DynamoClient,
    helpers: IHelpers,
    input?: any,
    currentStack?: Array<Chaining<ChainingKind>>,
  ) {
    this.stack = currentStack || []
    this.kind = kind
    this.dynamoClient = dynamoClient
    this.helpers = helpers
    this.input = input
    this.stack.push(this)
  }

  protected extractFromStack(): any {
    const inputs = this.stack.reduce((acc, item) => {
      acc[item.kind as any] = item.input
      return acc
    }, {})
    return inputs as any
  }
}
