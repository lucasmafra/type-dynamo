import { Then } from 'cucumber'
import * as expect from 'expect'
import { orderBy } from 'lodash'

Then('I should get the following item:', function(dataTable) {
  const [item] = dataTable.hashes()
  expect(this.result).toEqual({data: item})
})

Then('I should get the following items in any order:', function(dataTable) {
  const items = dataTable.hashes()
  // @ts-ignore
  expect(this.result.data).toEqual(expect.arrayContaining(items))
  // @ts-ignore
  expect(items).toEqual(expect.arrayContaining(this.result.data))
})

Then('I should get the following items:', function(dataTable) {
  const items = dataTable.hashes()
  expect(this.result.data).toEqual(items)
})
