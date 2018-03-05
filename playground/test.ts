import { contains, isLessOrEqualTo, match, size } from '../src/schema/chaining/expressions'
import User from './User'

async function scanTest() {
    const users = await User.scan().allResults()
}

async function queryTest() {
    const users = await User
    .query({ companyName: 'Appsimples'})
    .withSortKeyCondition(isLessOrEqualTo(792245501000))
    .allResults()
}

scanTest()
queryTest()
