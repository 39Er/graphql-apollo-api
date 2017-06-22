'use strict';

const { User } = require('./connector');

class UserModel {
  async getUsername(id) {
    let user = await User.findById(id).exec();
    return user.username;
  }
}
module.exports.UserModel = UserModel;
