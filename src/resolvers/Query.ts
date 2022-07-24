import { Post, User, Profile } from '@prisma/client'
import { Context } from '../index'

export const Query = {
    posts: async (_: any, __: any, { prisma }: Context): Promise<Post[]> => {
        const posts = await prisma.post.findMany({
            orderBy: [{ createdAt: 'desc' }],
        })
        return posts
    },
    me: async (_: any, __: any, { prisma, userInfo }: Context): Promise<User | null> => {
        if (!userInfo) {
            return null
        }
        return prisma.user.findFirst({
            where: {
                id: userInfo.userId,
            },
        })
    },
    profile: async (_: any, { userId }: { userId: string }, { prisma }: Context): Promise<Profile | null> => {
        return prisma.profile.findUnique({
            where: {
                userId: userId,
            },
        })
    },
}
