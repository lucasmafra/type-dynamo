export default abstract class Expression {
        public stack: Expression[]
        public kind: string
        constructor(kind: string, stack?: Expression[]) {
            this.kind = kind
            this.stack = stack ? stack.slice() : new Array<Expression>()
        }
}
