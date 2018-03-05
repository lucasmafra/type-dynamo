import { isBetween, match, size } from '../src/schema/chaining/expressions'
import User from './User'

async function scanTest() {
    let lastKey: { companyName: string, hiringDate: number } | undefined
    let firstTime = true
    while (lastKey || firstTime) {
        firstTime = false
        const users = await User.scan().paginate(2, lastKey)
        lastKey = users.lastKey
    }
}

async function queryTest() {
    const timestampA = new Date(1950, 5, 1).getTime()
    const timestampB = new Date(2000, 1, 1).getTime()

    const users1 = await User
    .query({ companyName: 'Appsimples'})
    .withSortKeyCondition(isBetween(timestampA, timestampB))
    .paginate(2)
    console.log(users1.data)
    if (users1.lastKey) {
        const users2 = await User
        .query({ companyName: 'Appsimples'})
        .withSortKeyCondition(isBetween(timestampA, timestampB))
        .paginate(2, users1.lastKey)
        console.log(users2.data)
    }
}

scanTest()
queryTest()
