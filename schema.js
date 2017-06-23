'use strict';

const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');

const mongoSchema = require('./mongo/schema').schema;
const mongoResolvers = require('./mongo/schema').resolvers;

const rootSchema = [`
  # query api
  type Query {
    # test graphql
    hello : String
    # Find the pet's owner
    owner(
      id:String!
      ):User

    # Find user's pets
    pets(
      id: String!
      limit: Int
    ):[Pet]
  }
  # mutation api
  type Mutation {
    gainPet(
      pet: PetInput!
      ):User
  }
`];

const rootResolvers = {
  Query: {
    hello() {
      return 'world';
    },
    owner: async function (root, { id }, context) {
      let owner = await context.Pet.getOwner(id);
      return owner;
    },
    pets: async function (root, { id, limit }, context) {
      let pets = await context.User.getPets(id, limit);
      return pets;
    },
  },
  Mutation: {
    gainPet: async function (root, { pet }, context) {
      let user = await context.User.findById(pet.owner);
      if (!user) {
        throw new Error('invilid owner');
      }
      let savedPet = await context.Pet.save(pet);
      user.pets.push(savedPet);
      let savedUser = await context.User.save(user);
      return savedUser;
    },
  },
};

const schema = [...rootSchema, ...mongoSchema];
const resolvers = merge(rootResolvers, mongoResolvers);

const executablesSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

module.exports = executablesSchema;

