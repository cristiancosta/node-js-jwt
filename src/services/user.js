// Constants.
const { errorMessage } = require('../constants');

// Repositories.
const userRepository = require('../repositories/user');

const getUser = async ({ id }) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error(errorMessage.USER_NOT_FOUND);
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
