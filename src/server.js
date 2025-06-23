// App.
const createExpressApp = require('./app');

// Configuration.
const configuration = require('./configuration');

// Database.
const createDatabaseConnection = require('./sequelize');

const { db } = configuration;
createDatabaseConnection(db)
  .sync()
  .then((sequelize) => {
    const { port } = configuration.server;
    createExpressApp(sequelize)
      .listen(port, () => console.log(`Server running on port ${port}`));
    console.log('Server connected to database');
  })
  .catch((error) =>
    console.log(
      `Server unable to connect to database: ${JSON.stringify(error)}`
    )
  );
