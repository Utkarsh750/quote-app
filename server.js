import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { typeDefs } from "./schemaGql.js";
import mongoose from "mongoose";
import { MONGO_URL } from "./config.js";

// mongodb+srv://megayt750:<password>@graphql.evo1wji.mongodb.net/?retryWrites=true&w=majority


mongoose.connect(MONGO_URL , {
  useNewUrlParser:true,
  useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb")
})

mongoose.connection.on("error", (err) => {
  console.log("error connecting", err)
})

// import models

import resolvers from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
