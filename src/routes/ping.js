const express = require('express');

// Controllers.
const ping = require('../controllers/ping');

const router = express.Router();

router.get('/', ping.get);

module.exports = router;
