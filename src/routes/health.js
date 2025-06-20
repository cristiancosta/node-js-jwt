const express = require('express');

// Controllers.
const healthController = require('../controllers/health');

const router = express.Router();

router.get('/', healthController.getHealthCheck);

module.exports = router;
