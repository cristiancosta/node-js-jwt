const { Sequelize } = require('sequelize');

// Models.
const initModels = require('./models');

const createDatabaseConnection = (dbConfig) => {
  const { database, user, password, host, port } = dbConfig;
  const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'postgres',
    logging: false
  });

  sequelize.authenticate();
  initModels(sequelize);
  return sequelize;
};

module.exports = createDatabaseConnection;
