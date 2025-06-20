const Sequelize = require('sequelize');

// Configuration.
const configuration = require('./configuration');

const { database, user, password, host, port } = configuration.db;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'postgres',
  logging: true,
});

sequelize.authenticate();

module.exports = sequelize;
