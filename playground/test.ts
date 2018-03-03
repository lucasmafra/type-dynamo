import { isIn, isLessOrEqualTo, match } from '../src/schema/chaining/filter'
import User from './User'

async function test() {
    const users = await User
    .scan()
    .filter(
        match('companyName', isIn(['Nubank', 'QuintoAndar']))
        .or.
        match('age', isLessOrEqualTo(25)),
    )
    .withAttributes(['id', 'name', 'age'])
    .paginate()

    console.log(users.data)
}

test()
