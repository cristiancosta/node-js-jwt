// App.
const app = require('./app');

// Configuration.
const configuration = require('./configuration');

// Database.
const database = require('./database');

database
  .sync()
  .then(() => console.log('Server connected to database'))
  .catch((error) => console.log(`Server unable to connect to database: ${JSON.stringify(error)}`))

app.listen(
  configuration.server.port,
  () => console.log(`Server running on port ${configuration.server.port}`)
);
