const { DataTypes } = require('sequelize');

// Database.
const sequelize = require('../sequelize');

// Constants.
const { modelName, tableName } = require('../constants');

const User = sequelize.define(modelName.USER, {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Username already exists',
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  timestamps: true,
  tableName: tableName.USERS,
});

module.exports = User;
