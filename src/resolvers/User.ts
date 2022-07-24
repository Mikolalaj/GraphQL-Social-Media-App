import { Post } from '@prisma/client'
import { Context } from '../index'

interface UserParentType {
    id: string
}

export const User = {
    posts: async (parent: UserParentType, __: any, { prisma }: Context): Promise<Post | null> => {
        return prisma.post.findUnique({
            where: {
                id: parent.id,
            },
        })
    },
}
