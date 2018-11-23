import { When } from 'cucumber'
import { User } from '../utils/models'

When(/I call User.update\(user\) with the following user:/,
  async (dataTable) => {
    const [user] = dataTable.hashes()
    await User.update(user)
  })

When(/I call User.update\(id, attributes\) with the following user:/,
  async (dataTable) => {
    const [{id, name}] = dataTable.hashes()
    await User.update(id, {name})
  })
