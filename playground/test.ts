import User from './User'

async function test() {
    const users = await User.onIndex.otherIndex
                        .scan().withAttributes(['name']).allResults()
    console.log(users.data)
}

test()
