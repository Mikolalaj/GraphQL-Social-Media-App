import { User } from '@prisma/client'
import { Context } from '../index'
import { userLoader } from '../loaders/userLoader'

interface PostParentType {
    authorId: string
}

export const Post = {
    user: async (parent: PostParentType, __: any, { prisma }: Context): Promise<User | null> => {
        return userLoader.load(parent.authorId)
    },
}
