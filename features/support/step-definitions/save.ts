import { When } from 'cucumber'
import { User } from '../utils/models'

When(/I call User\.save\(user\) with the following user:/,
  async (dataTable) => {
    const [item] = dataTable.hashes()
    await User.save(item).execute()
  })

When(/I call User\.save\(users\) with the following users:/,
  async (dataTable) => {
    const items = dataTable.hashes()
    await User.save(items).execute()
  })
