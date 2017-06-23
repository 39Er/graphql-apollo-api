'use strict';

const { UserDao, PetDao } = require('./connector');

class User {
  async findById(id) {
    let user = await UserDao.findById(id).exec();
    return user;
  }
  async save(user) {
    let result = await UserDao.create(user);
    return result;
  }
  async getPets(id, limit) {
    let user = await UserDao.findById(id).populate({
      path: 'pets',
      options: {
        limit: limit,
      },
    }).exec();
    return user.pets;
  }
}
class Pet {
  async save(pet) {
    let result = await PetDao.create(pet);
    return result;
  }
  async getOwner(id) {
    let pet = await PetDao.findById(id).populate('owner').exec();
    return pet.owner;
  }
}
module.exports.User = User;
module.exports.Pet = Pet;
