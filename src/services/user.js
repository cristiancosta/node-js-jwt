// Constants.
const { errorMessage } = require("../constants");

// Repositories.
const userRepository = require("../repositories/user"); 2

const getUser = async ({ id }) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error(errorMessage.USER_NOT_FOUND);
  }
};

module.exports = {
  getUser,
};
