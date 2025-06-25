const { Op } = require('sequelize');

// Errors.
const InternalServerError = require('../errors/internal-server');

// Constants.
const { errorMessage, modelName } = require('../constants');

const userRepository = (database) => {
  const User = database.model(modelName.USER);

  const getUserByUsername = async (username) => {
    try {
      const where = {
        username: {
          [Op.iLike]: username
        }
      };
      const user = await User.findOne({ where });
      const result = user ? mapUserModelToUserDto(user) : null;
      return result;
    } catch (error) {
      console.error('getUserByUsername#error', error);
      throw new InternalServerError(errorMessage.USER_RETRIEVAL_FAILURE);
    }
  };

  const createUser = async ({ username, password }) => {
    try {
      const user = await User.create({ username, password });
      return mapUserModelToUserDto(user);
    } catch (error) {
      console.error('createUser#error', error);
      throw new InternalServerError(errorMessage.USER_CREATION_FAILURE);
    }
  };

  const getUserById = async (id) => {
    try {
      const user = await User.findByPk(id);
      const result = user ? mapUserModelToUserDto(user) : null;
      return result;
    } catch (error) {
      console.error('getUserById#error', error);
      throw new InternalServerError(errorMessage.USER_RETRIEVAL_FAILURE);
    }
  };

  const getUserByIdAndGeneratedRefreshToken = async (
    id,
    generatedRefreshToken
  ) => {
    try {
      const where = { id, generated_refresh_token: generatedRefreshToken };
      const user = await User.findOne({ where });
      const result = user ? mapUserModelToUserDto(user) : null;
      return result;
    } catch (error) {
      console.error('getUserByIdAndGeneratedRefreshToken#error', error);
      throw new InternalServerError(errorMessage.USER_RETRIEVAL_FAILURE);
    }
  };

  const setGeneratedRefreshToken = async (id, refreshToken) => {
    try {
      await User.update(
        { generated_refresh_token: refreshToken },
        {
          where: {
            id
          }
        }
      );
    } catch (error) {
      console.error('setGeneratedRefreshToken#error', error);
      throw new InternalServerError(errorMessage.USER_UPDATE_FAILURE);
    }
  };

  const mapUserModelToUserDto = (userModel) => {
    const userDto = {
      id: userModel.id,
      username: userModel.username,
      password: userModel.password,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    };
    return userDto;
  };

  return {
    getUserByUsername,
    createUser,
    getUserById,
    getUserByIdAndGeneratedRefreshToken,
    setGeneratedRefreshToken
  };
};

module.exports = userRepository;
