// Repositories.
const userRepository = require('../repositories/user');

const signIn = async ({ username, password }) => {
  const user = await userRepository.getUserByUsername(username);
  return user;
};

module.exports = {
  signIn
};
