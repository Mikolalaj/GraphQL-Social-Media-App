import { ApolloServer } from 'apollo-server'
import typeDefs from './schema'
import { Query, Profile, Post, User, Mutation } from './resolvers'
import { PrismaClient, Prisma } from '@prisma/client'
import { getUserFromToken } from './utils'

export const prisma = new PrismaClient()

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation>
    userInfo: {
        userId: string
    } | null
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Profile,
        Post,
        User,
        Mutation,
    },
    context: ({ req }): Context => {
        const userInfo = getUserFromToken(req.headers.authorization || '')
        return {
            prisma,
            userInfo,
        }
    },
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
