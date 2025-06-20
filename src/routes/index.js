const express = require('express');

// Routes.
const authRoute = require('./auth');
const healthRoute = require('./health');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/health', healthRoute);

module.exports = router;
