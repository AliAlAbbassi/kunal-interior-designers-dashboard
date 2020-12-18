export const resolvers = {
  Query: {
    sensitiveInformation: () => 'Sensitive info',
    loginResult: (_, __, ctx) => {
      return ctx
    },
  },
}
