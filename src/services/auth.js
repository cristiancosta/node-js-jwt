const { v4: uuidv4 } = require('uuid');
const { compareSync, hashSync } = require('bcryptjs');

// Constants.
const { errorMessage, tokenSubject } = require('../constants');

// Errors.
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/not-found');
const UnauthorizedError = require('../errors/unauthorized');

// Utils.
const { createJwt, verifyJwt } = require('../utils');

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
    const accessToken = createJwt(tokenSubject.ACCESS_TOKEN, { id: user.id });
    const uuid = uuidv4();
    const refreshToken = createJwt(tokenSubject.REFRESH_TOKEN, {
      id: user.id,
      uuid
    });
    await userRepository.updateRefreshUuid(user.id, uuid);
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
    const { id, uuid } = verifyJwt(refreshToken, tokenSubject.REFRESH_TOKEN);
    const user = await userRepository.getUserByIdAndRefreshUuid(id, uuid);
    if (!user) {
      throw new UnauthorizedError(errorMessage.INVALID_USER_TOKEN);
    }
    const newAccessToken = createJwt(tokenSubject.ACCESS_TOKEN, {
      id: user.id
    });
    const newUuid = uuidv4();
    const newRefreshToken = createJwt(tokenSubject.REFRESH_TOKEN, {
      id: user.id,
      uuid: newUuid
    });
    await userRepository.updateRefreshUuid(user.id, newUuid);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  };

  return {
    signIn,
    signUp,
    refresh
  };
};

module.exports = authService;
