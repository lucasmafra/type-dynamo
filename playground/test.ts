import { isBetween, match, size } from '../src/chaining/expressions'
import User from './User'

async function scanTest() {
    const users = await User.find().withAttributes(['email']).paginate().execute()
    console.log('SCAN', users.data)
}

async function queryTest() {
    const users = await User.find({companyName: 'AppSimples'}).withAttributes(['email']).paginate().execute()
    console.log('QUERY', users.data)
}

async function getTest() {
    const user = await User
                .find({ companyName: 'AppSimples', hiringDate: 1457654935000 })
                .withAttributes(['email']).execute()
    console.log('GET', user.data)
}

scanTest()
queryTest()
getTest()
