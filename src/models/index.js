const initUserModel = require('./user');

const initModels = (sequelize) => {
  initUserModel(sequelize);
};

module.exports = initModels;
