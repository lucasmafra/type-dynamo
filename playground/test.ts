import { isLessOrEqualTo, match, size } from '../src/schema/chaining/expressions'
import User from './User'

async function test() {
    const users = await User.scan().allResults()
}

test()
