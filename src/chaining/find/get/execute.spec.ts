import { Chaining } from '../../common'
import { Executor } from './execute'
import { IGetInput as IGet } from './get'
import { DynamoGet, GetChainingKind } from './index'
import { DynamoGetWithAttributes } from './with-attributes'
import anything = jasmine.anything

jest.mock('../../../database-operations/get')

interface IBankAccountModel { accountId: number, runningBalance: number }
interface IBankAccountKeySchema { accountId: number }

const input: IGet<IBankAccountKeySchema> = {
  schema: { tableName: 'BankAccountTable', dynamoPromise: undefined as any },
  key: { accountId: 1 },
}

let stack: Array<Chaining<GetChainingKind>>

describe('Executor', () => {
  it('executes get operation with info from stack', async () => {
    stack = [
      new DynamoGet<IBankAccountModel, IBankAccountKeySchema>(input),
    ]
    const getMock = { execute: jest.fn() }
    await new Executor(getMock as any).execute(stack)
    expect(getMock.execute)
      .toHaveBeenCalledWith(input, { withAttributes: undefined })
  })

  context('when stack has withAttributes element', () => {
    it('executes get operation with attributes', async () => {
      stack = [
        new DynamoGet<IBankAccountModel, IBankAccountKeySchema>(input),
        new DynamoGetWithAttributes<IBankAccountModel, IBankAccountKeySchema>(
          ['id'], [],
        ),
      ]
      const getMock = { execute: jest.fn() }
      await new Executor(getMock as any).execute(stack)
      expect(getMock.execute).toHaveBeenCalledWith(input, {
        withAttributes: anything(),
      })
    })
  })
})
