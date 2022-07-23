import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { ZodError } from 'zod'
import { Context } from '../..'

const deleteNotUsedFields = <T>(obj: T): T => {
    for (const key in obj) {
        if (obj[key] === null) {
            delete obj[key]
        }
    }
    return obj
}

export type userErrorsType = {
    message: string
}[]

const stringifyZodError = (error: ZodError): userErrorsType => {
    return error.issues.map(field => {
        return { message: `${field.message} (${field.path.join('.')})` }
    })
}

const createJWT = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1d' })
}

const canUserMutatePost = async (userId: string, postId: string, prisma: Context['prisma']): Promise<userErrorsType> => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    })

    if (!user) {
        return [{ message: 'User not found' }]
    }

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
        },
    })

    if (!post) {
        return [{ message: 'Post not found' }]
    }

    if (user.id !== post.authorId) {
        return [{ message: 'You are not the author of this post' }]
    }

    return []
}

export { deleteNotUsedFields, stringifyZodError, createJWT, canUserMutatePost }
