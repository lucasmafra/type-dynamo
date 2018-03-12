import { attributeNotExists, isBetween, isIn, isLessOrEqualTo, isNotEqualTo, match, size } from '../src/expressions'
import { mockUsers } from './mock'
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

async function scanOnIndexTest() {
    const users = await User.onIndex.emailIndex
                        .find()
                        .filter(
                            match('companyName', isIn(['Nubank', 'QuintoAndar']))
                            .and.
                            match('age', isLessOrEqualTo(25)),
                        )
                        .allResults()
                        .execute()
    console.log('SCAN ON INDEX', users.data)
}

async function queryOnIndexTest() {
    const users = await User.onIndex.emailIndex
                        .find({email: 'lucas.mafra95@gmail.com'})
                        .allResults()
                        .execute()
    console.log('QUERY ON INDEX', users.data)
}

async function putTest() {
    const user = await  User
                        .save({
                            email: 'maithe@gmail.com',
                            name: 'Maithe',
                            companyName: 'Nubank',
                            hiringDate: 1520748307000,
                            age: 22,
                        })
                        .withCondition(
                            attributeNotExists('companyName').and.attributeNotExists('hiringDate'),
                        )
                        .execute()
    console.log('PUT', user.data)
}

async function batchWriteTest() {
    const user = await  User.save(mockUsers).execute()
    console.log('PUT', user.data)
}

async function deleteTest() {
    const oldUser = await User
                        .delete({companyName: 'Nubank', hiringDate: 1394507537000})
                        .withCondition(match('companyName', isNotEqualTo('Nubank')))
                        .execute()
    console.log('DELETE', oldUser.data)
}

// scanTest()
// queryTest()
// getTest()
// batchGetTest()
// scanOnIndexTest()
// queryOnIndexTest()
// putTest()
// batchWriteTest()
deleteTest()
