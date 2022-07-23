import { Post, Prisma } from '@prisma/client'
import { Context } from '../../index'
import { deleteNotUsedFields } from './utils'

interface PostArgs {
    newValues: {
        title: string
        content: string
    }
}

interface PostUpdateArgs extends PostArgs {
    postId: string
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[]
    post: Post | null
}

export const PostMutations = {
    postCreate: async (_: any, { newValues }: PostArgs, { prisma }: Context): Promise<PostPayloadType> => {
        const { title, content } = newValues
        if (!title || !content) {
            return {
                userErrors: [{ message: 'Title and content are required' }],
                post: null,
            }
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: '492f5165-978d-4f45-8d58-151bcedb6df1',
            },
        })

        return {
            userErrors: [],
            post,
        }
    },
    postUpdate: async (_: any, { postId, newValues }: PostUpdateArgs, { prisma }: Context): Promise<PostPayloadType> => {
        if (!postId) {
            return {
                userErrors: [{ message: 'PostId is required' }],
                post: null,
            }
        }

        if (!newValues.title && !newValues.content) {
            return {
                userErrors: [{ message: 'Title or content is required' }],
                post: null,
            }
        }

        // if (!newValues.title) delete newValues.title
        // if (!newValues.content) delete newValues.content

        try {
            const post = await prisma.post.update({
                where: {
                    id: postId,
                },
                data: deleteNotUsedFields(newValues),
            })

            return {
                userErrors: [],
                post,
            }
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return {
                        userErrors: [{ message: `Post with id '${postId}' was not found` }],
                        post: null,
                    }
                }
            }
        }

        return {
            userErrors: [{ message: 'Something went wrong' }],
            post: null,
        }
    },
    postDelete: async (_: any, { postId }: { postId: string }, { prisma }: Context): Promise<PostPayloadType> => {
        if (!postId) {
            return {
                userErrors: [{ message: 'PostId is required' }],
                post: null,
            }
        }

        try {
            await prisma.post.delete({
                where: {
                    id: postId,
                },
            })

            return {
                userErrors: [],
                post: null,
            }
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return {
                        userErrors: [{ message: `Post with id '${postId}' was not found` }],
                        post: null,
                    }
                }
            }
        }

        return {
            userErrors: [{ message: 'Something went wrong' }],
            post: null,
        }
    },
}
