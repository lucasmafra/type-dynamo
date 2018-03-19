import {
    attributeNotExists, isBetween, isGreaterThan, isIn, isLessOrEqualTo, isNotEqualTo, match, size,
} from '../src/expressions'
import { mockUsers } from './mock'
import User from './User'

async function scanTest() {
    const users = await User
                        .find()
                        // .filter(
                        //     match('companyName', isIn(['Nubank', 'QuintoAndar']))
                        //     .and.
                        //     match('age', isLessOrEqualTo(24)),
                        // )
                        .withAttributes(['email'])
                        .allResults()
                        .execute()
    console.log('SCAN', users.data)
}

async function queryTest() {
    const users = await User
                        .find({companyName: 'JumpXS'})
                        // .withSortKeyCondition(isBetween(1457665937000, 1520737937000))
                        .filter(
                            match('age', isGreaterThan(30)),
                        )
                        .withAttributes(['age'])
                        .paginate(4)
                        .execute()
    console.log('QUERY', users.data)
}

async function getTest() {
    const user = await  User
                        .find({ companyName: 'Nubank', hiringDate: 1394507537000 })
                        .execute()
    console.log('GET', user.data)
}

async function batchGetTest() {
    const keys = mockUsers.map(
        (user) => ({ companyName: user.companyName, hiringDate: new Date(user.hiringDate).getTime()}),
    )
    const users = await User
                        .find(keys)
                        .withAttributes(['name'])
                        .execute()
    console.log('BATCHGET', users.data)
}

async function scanOnIndexTest() {
    const users = await User.onIndex.emailIndex
                        .find()
                        // .filter(
                        //     match('companyName', isIn(['Nubank', 'QuintoAndar']))
                        //     .and.
                        //     match('age', isGreaterThan(30)),
                        // )
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
    const users = await User.save(
        mockUsers.map((mock) => ({ ...mock, hiringDate: new Date(mock.hiringDate).getTime()})),
    ).execute()
    // console.log('BATCH WRITE', users.data)
}

async function deleteTest() {
    const oldUser = await User
                        .delete({companyName: 'Nubank', hiringDate: 1394507537000})
                        // .withCondition(match('companyName', isNotEqualTo('Nubank')))
                        .execute()
    console.log('DELETE', oldUser.data)
}

async function batchDeleteTest() {
        await User
        .delete(
            mockUsers.map((mock) => (
                { companyName: mock.companyName, hiringDate: new Date(mock.hiringDate).getTime() }
            )),
        )
        .execute()
        console.log('BATCH DELETE')
}

async function updateTestWithExplicit() {
     const key = { companyName: mockUsers[0].companyName, hiringDate: new Date(mockUsers[0].hiringDate).getTime() }
     const updatedUser = await User
                        .update(key, {
                            name: 'John Doe',
                            age: 50,
                            ...key,
                         })
                        .execute()
     console.log('UPDATE', updatedUser.data)
}

async function updateTestWithImplicit() {
    const key = { companyName: mockUsers[0].companyName, hiringDate: new Date(mockUsers[0].hiringDate).getTime() }
    const updatedUser = await User
                        .update({
                            name: 'John Doe',
                            age: 40,
                            ...key,
                         })
                        .execute()
    console.log('UPDATE', updatedUser.data)
}

// scanTest()
// queryTest()
// getTest()
// batchGetTest()
// scanOnIndexTest()
// queryOnIndexTest()
// putTest()
// batchWriteTest()
// deleteTest()
// batchDeleteTest()
// updateTestWithExplicit()
// updateTestWithImplicit()
