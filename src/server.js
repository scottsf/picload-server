const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    hello(name: String): String!
  }

  type Mutation {
    createComment(comment: String!): String!
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },

  Mutation: {
    createComment: (parent, args, ctx, info) => {
      console.log('test')
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