const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDoc = swaggerJSDoc({
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'node-js-jwt',
      version: '1.0.0',
      description: 'node-js-jwt docs'
    },
    externalDocs: {
      description: 'OpenAPI Specification',
      url: 'https://swagger.io/specification/v3/'
    }
  },
  apis: [`${__dirname}/routes/**/**.js`]
});

module.exports = swaggerDoc;
