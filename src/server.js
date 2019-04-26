import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import Mutation from "./resolvers/Mutation";
import Query from "./resolvers/Query";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import User from "./resolvers/User";

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
    User
  },

  context: {
    db
  }
});

server.start(options, () =>
  console.log(`Server is running on ${options.port}`)
);
