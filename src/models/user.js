const { DataTypes } = require('sequelize');

// Constants.
const { modelName } = require('../constants/model-name');
const { tableName } = require('../constants/table-name');

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
      refresh_uuid: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      underscored: true,
      timestamps: true,
      tableName: tableName.USERS
    }
  );

module.exports = { initUserModel };
