// App.
const createExpressApp = require('./app');

// Configuration.
const configuration = require('./configuration');

// Database.
const createDataSource = require('./data-source');

const { db } = configuration;
createDataSource(db)
  .sync()
  .then((dataSource) => {
    const { port } = configuration.server;
    createExpressApp(dataSource).listen(port, () =>
      console.log(`Server running on port ${port}`)
    );
    console.log('Server connected to database');
  })
  .catch((error) =>
    console.log(
      `Server unable to connect to database: ${JSON.stringify(error)}`
    )
  );
