export default abstract class Expression {
        protected stack: Expression[]
        protected kind: string
        constructor(kind: string, stack?: Expression[]) {
            this.kind = kind
            this.stack = stack ? stack.slice() : new Array<Expression>()
        }
}
