import { GraphQLServer } from 'graphql-yoga'
import db from './db'

const typeDefs = `
  type Query {
    users(query: String!): [User!]!
    posts(query:String!): [Post!]!
    comments(query:String!): [Comment!]!
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    password: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
    updatedAt: String!
    createdAt: String!
  }
`

const resolvers = {
  Query: {
    users(parent, args, ctx, info) { // not method
      return db.users.map(user => {
        return user
      })
    },

    posts(parent, args, ctx, info) {
      if (!args.query) {
        return db.posts
      }
    },
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return db.comments
      }
    }

  },

  Post: {
    author: (parent, args, ctx, info) => {
      return db.users.find(user => {  
        if (user.id === parent.author_id) {
          return user
        }
      })
    }
  },

  User: {
    posts(parent, args, ctx, info) {
      return db.posts.filter(post => { 
        return post.author_id === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return db.users.find(user => user.id === parent.author_id)
    },

    post(parent, args, ctx, info) {
      return db.posts.find(post => post.id === parent.post_id)

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