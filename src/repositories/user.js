const { Op } = require('sequelize');

// Models.
const User = require('../models/user');

const getUserByUsername = async (username) => {
  const where = {
    username: {
      [Op.iLike]: username
    }
  };
  const user = await User.findOne({ where });
  const result = user ? mapUserModelToUserDto(user) : null;
  return result;
};

const createUser = async ({ username, password }) => {
  const user = await User.create({ username, password });
  return mapUserModelToUserDto(user);
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  const result = user ? mapUserModelToUserDto(user) : null;
  return result;
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

module.exports = {
  getUserByUsername,
  createUser,
  getUserById,
};
