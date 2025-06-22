// App.
const app = require('./app');

// Configuration.
const configuration = require('./configuration');

// Database.
const sequelize = require('./sequelize');

sequelize
  .sync()
  .then(() => console.log('Server connected to database'))
  .catch((error) =>
    console.log(
      `Server unable to connect to database: ${JSON.stringify(error)}`
    )
  );

const { port } = configuration.server;
app.listen(port, () => console.log(`Server running on port ${port}`));
