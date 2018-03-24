import { AuthorIndexKey, EntityIndexKey, FeedRepo } from './Feed'

const getFeedByAuthor = async (limit: number = 50, authorId: string, lastKey?: AuthorIndexKey) => {
    try {
        const result = await FeedRepo.onIndex.authorIndex
        .find({ authorId })
        .paginate(limit, lastKey)
        .execute()
        console.log(result)
    } catch (err) {
        console.log(err)
    }

}

const getFeedByEntity = async (limit: number = 50, group: string, lastKey?: EntityIndexKey) => {
    try {
        const result = await FeedRepo.onIndex.entityIndex
        .find({ entityGroup: group })
        .withOptions({
            order: 'descending',
        })
        .paginate(limit, lastKey)
        .execute()
        console.log(result)
    } catch (err) {
        console.log(err)
    }
}

const getAll = async () => {
    const result = await FeedRepo.find().allResults().execute()
    console.log('result', result.data)
}

const queryAll = async () => {
    const result = await FeedRepo
        .find({ generalGroup: 'general-group-0'})
        .withOptions({
            order: 'descending',
        })
        .allResults()
        .execute()
    console.log('result', result.data)
}

// getFeedByAuthor(
//     3,
//     '0',
//     { authorId: '0',
//     generalGroup: 'general-group-0',
//     timestamp: 1523761200000 },

//     // { authorId: '0', timestamp: 1531623600000, generalGroup: 'general-group-0' },
// )

queryAll()

getFeedByEntity(
    2,
    'technology-group-0',
)
// getAll()
