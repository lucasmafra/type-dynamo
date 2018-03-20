import {
    attributeNotExists, isBetween, isGreaterThan, isIn, isLessOrEqualTo, isNotEqualTo, match, size,
} from '../src/expressions'
import { mockUsers } from './mock'
import { UserRepo } from './User'

async function scanTest() {
    const users = await UserRepo
                        .find()
                        // .filter(
                        //     match('companyName', isIn(['Nubank', 'QuintoAndar']))
                        //     .and.
                        //     match('age', isLessOrEqualTo(24)),
                        // )
                        .withAttributes(['email'])
                        .allResults()
                        .execute()
    console.log('SCAN', users.data.length)
}

async function queryTest() {
    const users = await UserRepo
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
    const user = await  UserRepo
                        .find({ companyName: 'Nubank', hiringDate: 1394507537000 })
                        .execute()
    console.log('GET', user.data)
}

async function batchGetTest() {
    const keys = mockUsers.map(
        (user) => ({ companyName: user.companyName, hiringDate: new Date(user.hiringDate).getTime()}),
    )
    const users = await UserRepo
                        .find(keys)
                        .withAttributes(['name'])
                        .execute()
    console.log('BATCHGET', users.data.length)
}

async function scanOnIndexTest() {
    const users = await UserRepo.onIndex.emailIndex
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
    const users = await UserRepo.onIndex.emailIndex
                        .find({companyName: 'bla'})
                        .allResults()
                        .execute()
    console.log('QUERY ON INDEX', users.data)
}

async function putTest() {
    const user = await  UserRepo
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
    const users = await UserRepo.save(
        mockUsers.map((mock) => ({ ...mock, hiringDate: new Date(mock.hiringDate).getTime()})),
    ).execute()
    // console.log('BATCH WRITE', users.data)
}

async function deleteTest() {
    const oldUser = await UserRepo
                        .delete({companyName: 'Nubank', hiringDate: 1394507537000})
                        // .withCondition(match('companyName', isNotEqualTo('Nubank')))
                        .execute()
    console.log('DELETE', oldUser.data)
}

async function batchDeleteTest() {
        await UserRepo
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
     const updatedUser = await UserRepo
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
    const updatedUser = await UserRepo
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
batchWriteTest()
// deleteTest()
// batchDeleteTest()
// updateTestWithExplicit()
// updateTestWithImplicit()
