// Constants.
const { errorMessage } = require('../constants');

// Repositories.
const userRepository = require('../repositories/user');

// Errors.
const NotFoundError = require('../errors/not-found');

const getUser = async ({ id }) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new NotFoundError(errorMessage.USER_NOT_FOUND);
  }
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

module.exports = {
  getUser
};
