import { gql } from 'apollo-server'

const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }

    type Mutation {
        postCreate(newValues: PostInput!): PostPayload!
        postUpdate(postId: ID!, newValues: PostInput!): PostPayload!
        postDelete(postId: ID!): PostPayload!
        signup(name: String!, email: String!, password: String!): AuthPayload
        # signup(name: String!, email: String!, password: String!, bio: String!): AuthPayload
    }

    input PostInput {
        title: String
        content: String
    }

    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }

    type AuthPayload {
        userErrors: [UserError!]
        token: String
    }

    type UserError {
        message: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        profile: Profile!
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: String!
        published: Boolean!
        user: User!
    }

    type Profile {
        id: ID!
        bio: String!
        user: User!
    }
`

export default typeDefs
