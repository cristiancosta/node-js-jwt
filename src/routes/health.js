const express = require('express');

const healthRoute = (database) => {
  const router = express.Router();

  // Controllers.
  const healthController = require('../controllers/health')(database);

  router.get('/', healthController.getHealthInfo);

  return router;
};

module.exports = healthRoute;
