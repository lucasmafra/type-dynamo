import { When } from 'cucumber'
import { Order, User } from '../utils/models'

When(/I call User\.find\({ id: '(.*)' }\)\.execute\(\)/, async function(id) {
  this.set(
    await User.find({id}).execute(),
  )
})

When(/I call User\.find\(ids\)\.execute\(\) with the following ids:/,
  async function(dataTable) {
    const ids = dataTable.hashes() as Array<{ id: string }>
    this.set(
      await User.find(ids).execute(),
    )
  })

When(/I call User\.find\(\)\.allResults\(\)\.execute\(\)/,
  async function() {
    this.set(
      await User.find().allResults().execute(),
    )
  })

When(/I call Order.find\({ userId: '(.*)' }\)\.paginate\(\)\.execute\(\)/,
  async function(userId) {
  this.set(
    await Order.find({ userId }).paginate().execute(),
  )
})
