import { gql } from 'apollo-server'

const typeDefs = gql`
    type Query {
        posts: [Post!]!
        me: User
        profile(userId: ID!): Profile
    }

    type Mutation {
        postCreate(newValues: PostInput!): PostPayload!
        postUpdate(postId: ID!, newValues: PostInput!): PostPayload!
        postDelete(postId: ID!): PostPayload!
        postPublish(postId: ID!): PostPayload!
        postUnpublish(postId: ID!): PostPayload!
        signup(name: String!, bio: String!, cridentials: CridentialsInput): AuthPayload
        signin(cridentials: CridentialsInput): AuthPayload
    }

    input PostInput {
        title: String
        content: String
    }

    input CridentialsInput {
        email: String!
        password: String!
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
