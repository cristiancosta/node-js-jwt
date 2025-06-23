const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

// Swagger specification.
const swaggerSpecification = require('./swagger');

// Middlewares.
const errorHandler = require('./middlewares/error-handler');
const swaggerBasicAuth = require('./middlewares/swagger-basic-auth');

const createExpressApp = (database) => {
  const app = express();

  // Routes.
  const routes = require('./routes')(database);

  app.use(bodyParser.json());
  app.use(
    '/api-docs',
    swaggerBasicAuth,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecification)
  );
  app.use('/', routes);
  app.use(errorHandler);

  return app;
};

module.exports = createExpressApp;
