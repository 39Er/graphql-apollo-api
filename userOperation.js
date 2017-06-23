'use strict';

const { UserDao } = require('./mongo/connector');
const { passwordEncrypt, encrypt } = require('./lib/passwordEncrypt');
const { logger } = require('./global');

module.exports.login = async function (req, res) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let result = await UserDao.findOne({ username: username }).exec();
    if (!result) {
      throw new Error('invlid user:%s', username);
    }
    let encryptedPassword = await encrypt(password, result.salt);
    if (encryptedPassword !== result.password) {
      throw new Error('password is incorrect');
    }
    req.session.user = result;
    res.send('login success');
  } catch (e) {
    logger.error(e);
    throw new Error(e.message);
  }
};

module.exports.register = async function register(req, res) {
  try {
    let query = await UserDao.findOne({
      username: req.body.username,
    }).exec();
    if (query) {
      await Promise.reject({
        statusCode: '501',
        message: '用户名已存在！',
      });
    }
    let encryptResult = await passwordEncrypt(req.body.password);
    let user = await UserDao.create({
      username: req.body.username,
      password: encryptResult.epassword,
      salt: encryptResult.salt,
      pets: [],
    });
    return res.send({
      statusCode: '200',
      username: user.username,
    });
  } catch (e) {
    logger.error(e);
    return res.send({
      statusCode: e.statusCode || '500',
      message: e.message || e.toString(),
    });
  }
};
