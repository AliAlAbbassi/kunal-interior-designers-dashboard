import { gql } from 'apollo-server'

export const typeDefs = gql`
  type PrivateType @auth {
    field: String
  }

  extend input CreateUserInput {
    firstName: String!
    lastName: String!
    img: String
    bio: String
    location: LocationInput
    responsibilities: Responsibilities
  }

  extend type User {
    firstName: String!
    lastName: String!
    img: String
    bio: String
    location: Location
    responsibilities: Responsibilities
  }

  type Location {
    country: String!
    city: String
  }
  input LocationInput {
    country: String!
    city: String
  }

  enum Responsibilities {
    GraphicDesign
    CustomerAssistant
  }

  type Query {
    # This query will be protected so only authenticated users can access it
    sensitiveInformation: String @auth
    me: User
    users: [User!]!
    loginResult: LoginResult
  }

  type Mutation {
    _: String
    updateUserProfile(
      location: LocationInput
      responsibilities: Responsibilities
      about: String
    ): LoginResult @auth
  }
`
