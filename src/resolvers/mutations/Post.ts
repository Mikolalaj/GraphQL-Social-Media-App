import { Post, Prisma } from '@prisma/client'
import { Context } from '../../index'
import { deleteNotUsedFields, canUserMutatePost } from './utils'

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
    postCreate: async (_: any, { newValues }: PostArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: 'Not authenticated' }],
                post: null,
            }
        }

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
                authorId: userInfo.userId,
            },
        })

        return {
            userErrors: [],
            post,
        }
    },
    postUpdate: async (_: any, { postId, newValues }: PostUpdateArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: 'Not authenticated' }],
                post: null,
            }
        }

        if (!postId) {
            return {
                userErrors: [{ message: 'PostId is required' }],
                post: null,
            }
        }

        const errors = await canUserMutatePost(userInfo.userId, postId, prisma)

        if (errors.length > 0) {
            return {
                userErrors: errors,
                post: null,
            }
        }

        if (!newValues.title && !newValues.content) {
            return {
                userErrors: [{ message: 'Title or content is required' }],
                post: null,
            }
        }

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
                } else {
                    return {
                        userErrors: [{ message: `Something went wrong (Prisma error code "${error.code}")` }],
                        post: null,
                    }
                }
            } else {
                return {
                    userErrors: [{ message: 'Something went wrong' }],
                    post: null,
                }
            }
        }
    },
    postDelete: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: 'Not authenticated' }],
                post: null,
            }
        }

        if (!postId) {
            return {
                userErrors: [{ message: 'PostId is required' }],
                post: null,
            }
        }

        const errors = await canUserMutatePost(userInfo.userId, postId, prisma)

        if (errors.length > 0) {
            return {
                userErrors: errors,
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
                } else {
                    return {
                        userErrors: [{ message: `Something went wrong (Prisma error code "${error.code}")` }],
                        post: null,
                    }
                }
            } else {
                return {
                    userErrors: [{ message: 'Something went wrong' }],
                    post: null,
                }
            }
        }
    },
}
