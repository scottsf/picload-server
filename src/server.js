import { GraphQLServer } from 'graphql-yoga'
import db from './db'

const typeDefs = `
  type Query {
    hello(name: String): String!
  }

  type Mutation {
    createComment(comment: String): [User]!
  }

  type User {
    id: String,
    text: String,
    author_id: String,
    post_id: String

  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },

  Mutation: {
    createComment: (parent, args, ctx, info) => {
      return db.map(user => user.id)
    }
  }
}

const options = {
  port: 4001,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(options, () => console.log(`Server is running on ${options.port}`))