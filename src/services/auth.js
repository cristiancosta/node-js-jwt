// Constants.
const { errorMessage } = require('../constants');

// Repositories.
const userRepository = require('../repositories/user');

const signIn = async ({ username, password }) => {
  const user = await userRepository.getUserByUsername(username);
  if (!user) {
    throw new Error(errorMessage.USER_NOT_FOUND);
  }
  return user;
};

module.exports = {
  signIn
};
