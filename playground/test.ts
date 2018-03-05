import { isBetween, match, size } from '../src/schema/chaining/expressions'
import User from './User'

async function scanTest() {
    const users = await User.scan().allResults()
    console.log(users.data)
}

async function queryTest() {
    const timestampA = new Date(1950, 5, 1).getTime()
    const timestampB = new Date(2000, 1, 1).getTime()

    const users = await User
    .query({ companyName: 'Appsimples'})
    .withSortKeyCondition(isBetween(timestampA, timestampB))
    .allResults()

    console.log(users.data)
}

scanTest()
// queryTest()
