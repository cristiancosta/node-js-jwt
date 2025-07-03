const expressBasicAuth = require('express-basic-auth');

// Configuration.
const { configuration } = require('../configuration');

const { username, password } = configuration.swagger;

const swaggerBasicAuth = expressBasicAuth({
  users: { [username]: password },
  challenge: true
});

module.exports = { swaggerBasicAuth };
