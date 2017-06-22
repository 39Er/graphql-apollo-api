'use strict';

const crypto = require('crypto');

module.exports.passwordEncrypt = passwordEncrypt;
module.exports.encrypt = encrypt;
/**
 * use randomBytes generate salt; use pbkdf2 encrypt password;
 * @param [String] password: (required)
 * @param [Number] iterations:times of encryption,default 1024 (optional)
 * @param [Number] keylen: the length of encryptedPassword,default 64(optional)
 * @param [String] disgest： Encryption Algorithm，default 'sha1'
 * @return [Promise] {salt,epassword}
 */
async function passwordEncrypt(password, iterations = 1024, keylen = 64, digest) {
  try {
    let salt = await genSalt();
    let encryptedPassword = await encrypt(password, salt, iterations, keylen, digest);
    return {
      salt: salt,
      epassword: encryptedPassword,
    };
  } catch (e) {
    return Promise.reject(e);
  }
}

function encrypt(password, salt, iterations = 1024, keylen = 64, digest) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, hash) => {
      if (err) reject(err);
      resolve(hash.toString('hex'));
    });
  });
}

function genSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, salt) => {
      if (err) return reject(err);
      return resolve(salt.toString('hex'));
    });
  });
}
