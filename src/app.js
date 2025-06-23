const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const expressBasicAuth = require('express-basic-auth');

// Routes.
const routes = require('./routes');

// Swagger specification.
const swaggerSpecification = require('./swagger');

// Configuration.
const configuration = require('./configuration');

// Middlewares.
const errorHandler = require('./middlewares/error-handler');

const app = express();

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

module.exports = app;
