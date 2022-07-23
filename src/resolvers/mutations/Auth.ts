import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { Context } from '../../index'
import bcrypt from 'bcryptjs'
import { stringifyZodError, createJWT, userErrorsType } from './utils'

const CridentialsArgs = z.object({
    cridentials: z.object({
        email: z.string().email().trim(),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),
})

const SignUpArgs = CridentialsArgs.extend({
    name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
    bio: z.string().trim().min(2, 'Bio must be at least 2 characters long'),
})

type CridentialsArgsType = z.infer<typeof CridentialsArgs>
type SignUpArgsType = z.infer<typeof SignUpArgs>

interface AuthPayloadType {
    userErrors: userErrorsType
    token: string | null
}

export const AuthMutations = {
    signup: async (_: any, { name, bio, cridentials }: SignUpArgsType, { prisma }: Context): Promise<AuthPayloadType> => {
        const newUser = SignUpArgs.safeParse({ cridentials, name, bio })

        if (newUser.success) {
            try {
                const user = await prisma.user.create({
                    data: {
                        email: cridentials.email,
                        name,
                        password: await bcrypt.hash(newUser.data.cridentials.password, 10),
                    },
                })

                await prisma.profile.create({
                    data: {
                        bio,
                        userId: user.id,
                    },
                })

                return {
                    userErrors: [],
                    token: createJWT(user.id),
                }
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        return {
                            userErrors: [{ message: 'Email already exists' }],
                            token: null,
                        }
                    } else {
                        return {
                            userErrors: [{ message: `Something went wrong (Prisma error code "${error.code}")` }],
                            token: null,
                        }
                    }
                } else {
                    return {
                        userErrors: [{ message: 'Something went wrong' }],
                        token: null,
                    }
                }
            }
        } else {
            return {
                userErrors: stringifyZodError(newUser.error),
                token: null,
            }
        }
    },
    signin: async (_: any, { cridentials }: CridentialsArgsType, { prisma }: Context): Promise<AuthPayloadType> => {
        const userCridentials = CridentialsArgs.safeParse({ cridentials })

        if (userCridentials.success) {
            const user = await prisma.user.findFirst({
                where: {
                    email: userCridentials.data.cridentials.email,
                },
            })

            const failedAuthPayload = {
                userErrors: [{ message: 'Invalid email or password' }],
                token: null,
            }

            if (user) {
                const isValid = await bcrypt.compare(cridentials.password, user.password)

                if (isValid) {
                    return {
                        userErrors: [],
                        token: createJWT(user.id),
                    }
                } else {
                    return failedAuthPayload
                }
            } else {
                return failedAuthPayload
            }
        } else {
            return {
                userErrors: stringifyZodError(userCridentials.error),
                token: null,
            }
        }
    },
}
