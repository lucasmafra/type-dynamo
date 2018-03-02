import User from './User'

async function test() {
    const users = await User
                        .scan().withAttributes(['id']).allResults()
    console.log(users)
}

test()
