// Repositories.
const userRepository = require('../repositories/user');

const signIn = async ({ username, password }) => {
  const user = await userRepository.getUserByUsername(username);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }
  return user;
};

module.exports = {
  signIn
};
