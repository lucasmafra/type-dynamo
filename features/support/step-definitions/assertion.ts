import { Then } from 'cucumber'
import * as expect from 'expect'
import { orderBy } from 'lodash'

Then('I should get the following item:', function(dataTable) {
  const [item] = dataTable.hashes()
  expect(this.result).toEqual({data: item})
})

Then('I should get the following items in any order:', function(dataTable) {
  const items = dataTable.hashes()
  expect(orderBy(this.result.data, 'id')).toEqual(orderBy(items, 'id'))
})

Then('I should get the following items:', function(dataTable) {
  const items = dataTable.hashes()
  expect(this.result.data).toEqual(items)
})
