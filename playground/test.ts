import { isBetween, isIn, isLessOrEqualTo, match, size } from '../src/chaining/expressions'
import User from './User'

async function scanTest() {
    const users = await User
                        .find()
                        .filter(
                            match('companyName', isIn(['Nubank', 'QuintoAndar']))
                            .and.
                            match('age', isLessOrEqualTo(24)),
                        )
                        .withAttributes(['email'])
                        .allResults()
                        .execute()
    console.log('SCAN', users.data)
}

async function queryTest() {
    const users = await User
                        .find({companyName: 'AppSimples'})
                        .withSortKeyCondition(isBetween(1457665937000, 1520737937000))
                        .filter(
                            size('name', isLessOrEqualTo(5)),
                        )
                        .withAttributes(['email'])
                        .allResults()
                        .execute()
    console.log('QUERY', users.data)
}

async function getTest() {
    const user = await  User
                        .find({ companyName: 'QuintoAndar', hiringDate: 1457665937000 })
                        .execute()
    console.log('GET', user.data)
}

async function batchGetTest() {
    const users = await User
                        .find([
                            { companyName: 'QuintoAndar', hiringDate: 1457665937000 },
                            { companyName: 'AppSimples', hiringDate: 1520737937000 },
                        ])
                        .withAttributes(['name'])
                        .execute()
    console.log('BATCHGET', users.data)
}

scanTest()
queryTest()
getTest()
batchGetTest()
