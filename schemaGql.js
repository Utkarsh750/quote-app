import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    quotes: [Quote]
    iquote(by: ID): [Quote]
  }
  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    quotes: [Quote]
  }

  type Quote {
    name: String
    by: ID!
  }

  type Mutation {
    signupUserDummy(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User
  }
`;
