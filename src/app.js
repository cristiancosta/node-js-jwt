const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const expressBasicAuth = require('express-basic-auth');

// Swagger specification.
const swaggerSpecification = require('./swagger');

// Configuration.
const configuration = require('./configuration');

// Middlewares.
const errorHandler = require('./middlewares/error-handler');

const createExpressApp = (database) => {
  const app = express();

  // Routes.
  const routes = require('./routes')(database);

  app.use(bodyParser.json());
  app.use(
    '/api-docs',
    expressBasicAuth({
      users: { [configuration.swagger.user]: configuration.swagger.password },
      challenge: true
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecification)
  );
  app.use('/', routes);
  app.use(errorHandler);

  return app;
};

module.exports = createExpressApp;
