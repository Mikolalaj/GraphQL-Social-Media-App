import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { Context } from '../../index'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const SignUpArgs = z.object({
    email: z.string().email().trim(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
    // bio: z.string().trim().min(2, 'Bio must be at least 2 characters long'),
})

type SignUpArgsType = z.infer<typeof SignUpArgs>

interface AuthPayloadType {
    userErrors: {
        message: string
    }[]
    token: string | null
}

export const AuthMutations = {
    signup: async (_: any, { email, password, name }: SignUpArgsType, { prisma }: Context): Promise<AuthPayloadType> => {
        const newUser = SignUpArgs.safeParse({ email, password, name })

        if (newUser.success) {
            try {
                const user = await prisma.user.create({
                    data: {
                        ...newUser.data,
                        password: await bcrypt.hash(newUser.data.password, 10),
                    },
                })

                return {
                    userErrors: [],
                    token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' }),
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
            const errors = newUser.error.issues.map(field => {
                return { message: `${field.message} (${field.path.join('.')})` }
            })
            return {
                userErrors: errors,
                token: null,
            }
        }
    },
}
