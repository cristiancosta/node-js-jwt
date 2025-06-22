// Constants.
const { compareSync } = require('bcryptjs');
const { errorMessage } = require('../constants');

// Repositories.
const userRepository = require('../repositories/user');
const { sign } = require('jsonwebtoken');
const configuration = require('../configuration');

const signIn = async ({ username, password }) => {
  const user = await userRepository.getUserByUsername(username.trim());
  if (!user) {
    throw new Error(errorMessage.USER_NOT_FOUND);
  }
  const isValidPassword = compareSync(password.trim(), user.password);
  if (!isValidPassword) {
    throw new Error(errorMessage.INVALID_CREDENTIALS);
  }

  const payload = { id: user.id };
  const { secret } = configuration.jwt;
  const options = { algorithm: "HS512" };

  options.subject = "ACCESS_TOKEN";
  options.expiresIn = configuration.jwt.accessTokenDuration;
  const accessToken = sign(payload, secret, options);

  options.subject = "REFRESH_TOKEN",
  options.expiresIn = configuration.jwt.refreshTokenDuration;
  const refreshToken = sign(payload, secret, options);

  return { accessToken, refreshToken };
};

module.exports = {
  signIn
};
