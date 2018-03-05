import { contains, isLessOrEqualTo, match, size } from '../src/schema/chaining/expressions'
import User from './User'

async function scanTest() {
    const users = await User.scan().allResults()
}

async function queryTest() {
    const users = await User
    .query({ companyName: 'Appsimples'})
    .withSortKeyCondition(isLessOrEqualTo((new Date(1998, 1, 1).getTime())))
    .allResults()
}

scanTest()
queryTest()
