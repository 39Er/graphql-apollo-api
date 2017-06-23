'use strict';

const schema = [`
  type User {
    id: String
    username: String
    pets: [String]
  }
  input PetInput {
    name: String!
    age: Int
    color: String
    owner: String
  }
  type Pet {
    id: String
    name: String
    age: Int
    color: String
    owner: String
  }
`];

const resolvers = {
  User: {
    id(obj) {
      return obj._id;
    },
  },
  Pet: {
    id(obj) {
      return obj._id;
    },
  },
};

module.exports.schema = schema;
module.exports.resolvers = resolvers;

