const { PostgreSqlContainer } = require('@testcontainers/postgresql');

// Database.
const createDatabaseConnection = require('../../src/sequelize');

// App.
const createExpressApp = require('../../src/app');

const buildResources = async () => {
  const container = await new PostgreSqlContainer('postgres')
    .withEnvironment({
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
      POSTGRES_DB: 'test'
    })
    .start();

  const dbConfig = {
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getPassword(),
    host: container.getHost(),
    port: container.getPort()
  };
  const database = await createDatabaseConnection(dbConfig).sync();
  const app = createExpressApp(database);

  const context = { container, database, app };
  return context;
};

const teardownResources = async (context) => {
  await context.database.close();
  await context.container.stop();
};

module.exports = {
  buildResources,
  teardownResources
};
