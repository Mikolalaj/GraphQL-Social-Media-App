import { User } from '@prisma/client'
import { Context } from '../index'

interface ProfileParentType {
    id: string
    bio: string
    userId: string
}

export const Profile = {
    user: async (parent: ProfileParentType, __: any, { prisma, userInfo }: Context): Promise<User | null> => {
        return prisma.user.findUnique({
            where: {
                id: parent.userId,
            },
        })
    },
}
