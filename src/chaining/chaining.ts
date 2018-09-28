export abstract class Chaining<ChainingKind> {
  protected kind: ChainingKind
  protected stack: Array<Chaining<ChainingKind>>
  protected input?: any

  constructor(
    kind: ChainingKind,
    input?: any,
    currentStack?: Array<Chaining<ChainingKind>>,
  ) {
    this.stack = currentStack || []
    this.kind = kind
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
