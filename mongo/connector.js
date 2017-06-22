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

const UserSchema = new Schema({
  username: {
    type: 'String',
  },
  password: {
    type: 'String',
  },
  salt: {
    type: 'String',
  },
});
const User = mongoose.model('User', UserSchema);
module.exports.User = User;
