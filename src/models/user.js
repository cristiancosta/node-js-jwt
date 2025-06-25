const { DataTypes } = require('sequelize');

// Constants.
const { modelName, tableName } = require('../constants');

const initUserModel = (sequelize) =>
  sequelize.define(
    modelName.USER,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username already exists'
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      generated_refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      underscored: true,
      timestamps: true,
      tableName: tableName.USERS
    }
  );

module.exports = initUserModel;
