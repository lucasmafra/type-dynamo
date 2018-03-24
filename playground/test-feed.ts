import { AuthorIndexKey, FeedRepo } from './Feed'

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

getFeedByAuthor(3, '0', { authorId: '0', timestamp: 1531623600000, generalGroup: 'general-group-0' } as any)
