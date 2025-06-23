const { compareSync, hashSync } = require('bcryptjs');
const {
  sign,
  verify,
  TokenExpiredError,
  JsonWebTokenError
} = require('jsonwebtoken');

// Constants.
const { errorMessage } = require('../constants');

// Repositories.
const userRepository = require('../repositories/user');

// Configuration.
const configuration = require('../configuration');

// Errors.
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');
const UnauthorizedError = require('../errors/unauthorized');

const signIn = async ({ username, password }) => {
  const user = await userRepository.getUserByUsername(username.trim());
  if (!user) {
    throw new NotFoundError(errorMessage.USER_NOT_FOUND);
  }
  const isValidPassword = compareSync(password.trim(), user.password);
  if (!isValidPassword) {
    throw new BadRequestError(errorMessage.INVALID_CREDENTIALS);
  }

  const payload = { id: user.id };
  const { secret } = configuration.jwt;
  const options = { algorithm: 'HS512' };

  options.subject = 'ACCESS_TOKEN';
  options.expiresIn = configuration.jwt.accessTokenDuration;
  const accessToken = sign(payload, secret, options);

  options.subject = 'REFRESH_TOKEN';
  options.expiresIn = configuration.jwt.refreshTokenDuration;
  const refreshToken = sign(payload, secret, options);

  return { accessToken, refreshToken };
};

const signUp = async ({ username, password }) => {
  const user = await userRepository.getUserByUsername(username.trim());
  if (user) {
    throw new ConflictError(errorMessage.USER_ALREADY_EXIST);
  }
  const hashedPassword = hashSync(password.trim());
  const createdUser = await userRepository.createUser({
    username: username.trim(),
    password: hashedPassword
  });
  return {
    id: createdUser.id,
    username: createdUser.username,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt
  };
};

const refresh = async ({ refreshToken }) => {
  const { secret } = configuration.jwt;

  // Verificar token.
  let verifiedPayload;
  try {
    verifiedPayload = verify(refreshToken, secret);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError(errorMessage.TOKEN_EXPIRED);
    }
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError(errorMessage.INVALID_TOKEN);
    }
  }

  // Validar usuario.
  const { id } = verifiedPayload;
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new NotFoundError(errorMessage.USER_NOT_FOUND);
  }

  // Crear nuevo par de tokens.
  const payload = { id: user.id };
  const options = { algorithm: 'HS512' };

  options.subject = 'ACCESS_TOKEN';
  options.expiresIn = configuration.jwt.accessTokenDuration;
  const newAccessToken = sign(payload, secret, options);

  options.subject = 'REFRESH_TOKEN';
  options.expiresIn = configuration.jwt.refreshTokenDuration;
  const newRefreshToken = sign(payload, secret, options);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

module.exports = {
  signIn,
  signUp,
  refresh
};
