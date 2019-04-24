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
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
    updatedAt: String!
    createdAt: String!
  }

  ############ MUTATIONS ############

  type Mutation {
    updateUser(data: updateUserInput!): User!
  }

  input updateUserInput {
    id: String! 
    name: String
    email: String
    password: String
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
    },

    comments: (parent, args, ctx, info) => {
      return db.comments.filter(comment => {
        if (comment.post_id === parent.id) {
          return comment
        }
      })
    }
  },

  User: {
    posts(parent, args, ctx, info) {
      return db.posts.filter(post => { 
        return post.author_id === parent.id
      })
    },

    comments(parent, args, ctx, info) {
      return db.comments.filter(comment => {
        if (comment.author_id === parent.id) {
          return comment
        }
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
  },

  Mutation: {
    updateUser(parent, args, ctx, info) {
      const user = db.users.find(user => user.id === args.data.id)
      return {...user, ...args.data}
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