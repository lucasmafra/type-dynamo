import { Then, When } from 'cucumber'
import * as expect from 'expect'
import { StudentClass } from '../utils/models'

When(/I call StudentClass\.onIndex\.classIndex\.find\({ class: '(.*)' }\)\.withAttributes\(\['student']\)\.execute\(\)/,
  async function(className) {
  this.set(
    await StudentClass.onIndex.classIndex
      .find({ class: className })
      .withAttributes(['student'])
      .execute(),
  )
})

Then(/I should get the (.*) from that class:/, async function(dataTable) {
  const students = dataTable.split(new RegExp(', ', 'g'))
    .map((student: any) => ({ student }))
  expect(this.result.data).toEqual(students)
})
