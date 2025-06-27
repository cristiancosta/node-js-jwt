const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

// Swagger specification.
const swaggerDoc = require('./swagger');

// Middlewares.
const { errorHandler, swaggerBasicAuth } = require('./middlewares');

const createExpressApp = (dataSource) => {
  const app = express();

  // Routes.
  const routes = require('./routes')(dataSource);

  app.use(bodyParser.json());
  app.use(
    '/api-docs',
    swaggerBasicAuth,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc)
  );
  app.use('/', routes);
  app.use(errorHandler);

  return app;
};

module.exports = createExpressApp;
