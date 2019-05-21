import '@babel/polyfill/noConflict'
import server from './server'

const options = {
  port: process.env.PORT || 4001,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground"
};

server.start(options, () =>
  console.log(`Server is running on ${options.port}`)
);
