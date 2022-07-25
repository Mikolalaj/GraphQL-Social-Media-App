import DataLoader from 'dataloader'
import { User } from '@prisma/client'
import { prisma } from '..'

type BatchUser = (ids: string[]) => Promise<User[]>

const batchUsers: BatchUser = async ids => {
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    })
    const userMap: { [key: string]: User } = {}

    users.forEach(user => {
        userMap[user.id] = user
    })
    return ids.map(id => userMap[id])
}

//@ts-ignore
export const userLoader = new DataLoader<string, User>(batchUsers)
