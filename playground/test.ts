import { isIn, isLessOrEqualTo, match } from '../src/schema/chaining/filter'
import User from './User'

async function test() {
    const users = await User
    .scan()
    .filter(
        // match('companyName', isIn(['Appsimples', 'QuintoAndar'])),
        // // .and.
        match('age', isLessOrEqualTo(23)),
    )
    // .withAttributes(['id'])
    .allResults()

    console.log(users.data)
}

test()
