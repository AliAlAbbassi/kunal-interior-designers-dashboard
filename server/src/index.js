const dotenv = require('dotenv').config()
const { ApolloServer, makeExecutableSchema } = require('apollo-server')
const {
  mergeTypeDefs,
  mergeResolvers,
} = require('@graphql-toolkit/schema-merging')
const { AccountsModule, authenticated } = require('@accounts/graphql-api')
const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')
const { Mongo } = require('@accounts/mongo')
const { AccountsServer, ServerHooks } = require('@accounts/server')
const { AccountsPassword } = require('@accounts/password')
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import connectDB from './config/db'
import MongoDBInterface from '@accounts/mongo'
import { DatabaseManager } from '@accounts/database-manager'
const objectId = mongoose.Types.ObjectId

import UserAPI from './datasources/user'

const start = async () => {
  // connectDB()

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = mongoose.connection

  const userStorage = new MongoDBInterface(db)
  const accountsDb = new DatabaseManager({
    sessionStorage: userStorage,
    userStorage,
  })

  // We tell accounts-js to use the mongo connection
  // const accountsMongo = new Mongo(db, {
  //   collectionName: 'users',
  // })

  // await accountsMongo.setupIndexes()

  const accountsPassword = new AccountsPassword({
    // You can customise the behavior of the password service by providing some options
    // This option is called when a new user create an account
    // Inside we can apply our logic to validate the user fields
    validateNewUser: (user) => {
      if (!user.firstName) {
        throw new Error('First name required')
      }
      if (!user.lastName) {
        throw new Error('Last name required')
      }

      // For example we can allow only some kind of emails
      if (user.email.endsWith('.xyz')) {
        throw new Error('Invalid email')
      }
      return user
    },
  })

  const accountsServer = new AccountsServer(
    {
      // We link the mongo adapter to the server
      db: accountsDb,
      // Replace this value with a strong random secret
      tokenSecret: 'kunalsuperrandomsecret',
    },
    {
      // We pass a list of services to the server, in this example we just use the password service
      password: accountsPassword,
    }
  )

  accountsServer.on(ServerHooks.ValidateLogin, ({ user }) => {
    // This hook is called every time a user try to login.
    // You can use it to only allow users with verified email to login.
    // If you throw an error here it will be returned to the client.
  })

  // We generate the accounts-js GraphQL module
  const accountsGraphQL = AccountsModule.forRoot({ accountsServer })

  const indexResolvers = {
    ...resolvers,
    Query: {
      ...resolvers.Query,
      me: (_, __, ctx) => {
        if (ctx.userId) {
          return accountsServer.findUserById(ctx.userId)
        }
        return null
      },
    },
    Mutation: {
      ...resolvers.Mutation,
      updateUserProfile: async (rootValue, args, context) => {
        await db
          .collection('users')
          .findOneAndUpdate(
            { _id: { $eq: objectId(context.userId) } },
            { $set: args },
            { upsert: true }
          )
        context.user = { ...context.user, ...args }
        return context
      },
    },
  }

  // A new schema is created combining our schema and the accounts-js schema
  const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([typeDefs, accountsGraphQL.typeDefs]),
    resolvers: mergeResolvers([accountsGraphQL.resolvers, indexResolvers]),
    schemaDirectives: {
      ...accountsGraphQL.schemaDirectives,
    },
  })

  const server = new ApolloServer({ schema, context: accountsGraphQL.context })

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

start()
