const express = require('express');

// Routes.
const auth = require('./auth');
const ping = require('./ping');

const router = express.Router();

router.use('/ping', ping);
router.use('/auth', auth);

module.exports = router;
