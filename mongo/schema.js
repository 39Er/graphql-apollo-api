'use strict';

const schema = [`
  type user {
    id: String
    username: String
  }
`];

const resolvers = {
  User: {
    username({ id }, _, context) {
      return context.UserModel.getUsername(id);
    },
  },
};

module.exports.schema = schema;
module.exports.resolvers = resolvers;

