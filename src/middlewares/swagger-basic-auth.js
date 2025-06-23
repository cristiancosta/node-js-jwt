const expressBasicAuth = require('express-basic-auth');

// Configuration.
const configuration = require('../configuration');

const { user, password } = configuration.swagger;

module.exports = expressBasicAuth({
  users: { [user]: password },
  challenge: true
});
