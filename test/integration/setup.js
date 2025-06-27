const { PostgreSqlContainer } = require('@testcontainers/postgresql');

// Database.
const createDataSource = require('../../src/data-source');

// App.
const createExpressApp = require('../../src/app');

const buildResources = async () => {
  const container = await new PostgreSqlContainer('postgres').start();

  const dbConfig = {
    database: container.getDatabase(),
    username: container.getUsername(),
    password: container.getPassword(),
    host: container.getHost(),
    port: container.getPort()
  };
  const dataSource = await createDataSource(dbConfig).sync();
  const app = createExpressApp(dataSource);

  const context = { container, dataSource, app };
  return context;
};

const teardownResources = async (context) => {
  await context.dataSource.close();
  await context.container.stop();
};

module.exports = {
  buildResources,
  teardownResources
};
