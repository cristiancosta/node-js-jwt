const { Op } = require('sequelize');

// Models.
const User = require('../models/user');

const getUserByUsername = async (username) => {
  const where = {
    username: {
      [Op.iLike]: username.trim()
    }
  };
  try {
    const user = await User.findOne({ where });
    const result = user ? mapUserModelToUserDto(user) : null;
    return result;
  } catch (error) {
    console.log(error);
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

module.exports = {
  getUserByUsername,
};
