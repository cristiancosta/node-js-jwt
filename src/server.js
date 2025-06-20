// App.
const app = require('./app');

// Configuration.
const configuration = require('./configuration');

app.listen(
  configuration.server.port,
  () => console.log(`Server running on port ${configuration.server.port}`)
);
