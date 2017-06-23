'use strict';

const mongoose = require('mongoose');
const { logger, config } = require('../global');

mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const dburl = 'mongodb://' + config.get('mongo.host')
  + ':' + config.get('mongo.port') + '/' + config.get('mongo.dbName');

mongoose.connect(dburl, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
});

const PetSchema = new Schema({
  name: {
    type: 'String',
  },
  color: {
    type: 'String',
  },
  age: {
    type: 'Number',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});
const Pet = mongoose.model('Pet', PetSchema);
module.exports.PetDao = Pet;

const UserSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  salt: {
    type: String,
  },
  pets: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Pet',
    }],
  },
});
const User = mongoose.model('User', UserSchema);
module.exports.UserDao = User;

