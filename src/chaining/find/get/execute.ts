import { Get, IGetResult } from '../../../database-operations/get'
import { Chaining, WithAttributes } from '../../common'
import { GetChainingKind } from './'
import { Get as IGet } from './get'

const extractFromStack = <KeySchema>(stack: Array<Chaining<GetChainingKind>>): {
  getMetadata: IGet<KeySchema>,
  withAttributes?: WithAttributes,
} => {
  const getMetadata = (stack[0] as any)._get
  let withAttributes: WithAttributes | undefined
  for (const current of stack) {
    switch ((current as any)._kind) {
      case 'withAttributes':
        withAttributes = (current as any)._withAttributes
    }
  }
  return { getMetadata, withAttributes }
}

export const execute = <Entity, KeySchema>(
  stack: Array<Chaining<GetChainingKind>>,
): Promise<IGetResult<Entity, KeySchema>> => {
  const {getMetadata, withAttributes} = extractFromStack<KeySchema>(stack)
  return new Get<Entity, KeySchema>(getMetadata).execute({withAttributes})
}
