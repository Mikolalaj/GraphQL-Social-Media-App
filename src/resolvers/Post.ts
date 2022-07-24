import { User } from '@prisma/client'
import { Context } from '../index'

interface PostParentType {
    authorId: string
}

export const Post = {
    user: async (parent: PostParentType, __: any, { prisma }: Context): Promise<User | null> => {
        return prisma.user.findUnique({
            where: {
                id: parent.authorId,
            },
        })
    },
}
