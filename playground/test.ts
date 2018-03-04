import { isLessOrEqualTo, match, size } from '../src/schema/chaining/expressions'
import User from './User'

async function test() {
    const users = await User.scan()
                        .filter(
                            size('name', isLessOrEqualTo(6)),
                        )
                        .withAttributes(['id', 'email'])
                        .paginate()
}

test()
