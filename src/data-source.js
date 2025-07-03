const { Sequelize } = require('sequelize');

// Models.
const { initModels } = require('./models');

const createDataSource = (dbConfig) => {
  const { database, username, password, host, port } = dbConfig;
  const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'postgres',
    logging: false
  });

  sequelize.authenticate();
  initModels(sequelize);
  return sequelize;
};

module.exports = { createDataSource };
