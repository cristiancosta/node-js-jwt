// Constants.
const { errorMessage } = require('../constants');

// Errors.
const NotFoundError = require('../errors/not-found');

const userService = ({ userRepository }) => {
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

  return {
    getUser
  };
};

module.exports = userService;
