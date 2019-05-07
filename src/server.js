import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Mutation from "./resolvers/Mutation";
import Query from "./resolvers/Query";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Subscription from './resolvers/Subscription'
import prisma from "./prisma"
const pubsub = new PubSub();

const options = {
  port: 4001,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground"
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Mutation,
    Query,
    Comment,
    Post,
    User,
    Subscription
  },

  context: {
    db,
    pubsub,
    prisma
  }
});

server.start(options, () =>
  console.log(`Server is running on ${options.port}`)
);
