const { v4: uuidv4 } = require('uuid');
const { compareSync, hashSync } = require('bcryptjs');
const {
  sign,
  verify,
  TokenExpiredError,
  JsonWebTokenError
} = require('jsonwebtoken');

// Constants.
const { errorMessage } = require('../constants');

// Configuration.
const configuration = require('../configuration');

// Errors.
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');
const UnauthorizedError = require('../errors/unauthorized');

const authService = (database) => {
  // Repositories.
  const userRepository = require('../repositories/user')(database);

  const signIn = async ({ username, password }) => {
    const user = await userRepository.getUserByUsername(username.trim());
    if (!user) {
      throw new NotFoundError(errorMessage.USER_NOT_FOUND);
    }
    const isValidPassword = compareSync(password.trim(), user.password);
    if (!isValidPassword) {
      throw new BadRequestError(errorMessage.INVALID_CREDENTIALS);
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await userRepository.setGeneratedRefreshToken(user.id, refreshToken);
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
    const { id } = verifiedPayload;
    const user = await userRepository.getUserByIdAndGeneratedRefreshToken(
      id,
      refreshToken
    );
    if (!user) {
      throw new UnauthorizedError(errorMessage.INVALID_USER_TOKEN);
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await userRepository.setGeneratedRefreshToken(user.id, newRefreshToken);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  };

  const generateAccessToken = (user) => {
    const { secret, accessTokenDuration } = configuration.jwt;
    const payload = { id: user.id };
    const options = {
      algorithm: 'HS512',
      subject: 'ACCESS_TOKEN',
      expiresIn: accessTokenDuration
    };
    const token = sign(payload, secret, options);
    return token;
  };

  const generateRefreshToken = (user) => {
    const { secret, refreshTokenDuration } = configuration.jwt;
    const payload = { id: user.id, uuid: uuidv4() };
    const options = {
      algorithm: 'HS512',
      subject: 'REFRESH_TOKEN',
      expiresIn: refreshTokenDuration
    };
    const token = sign(payload, secret, options);
    return token;
  };

  return {
    signIn,
    signUp,
    refresh
  };
};

module.exports = authService;
