const express = require('express');

// Routes.
const auth = require('./auth');

const router = express.Router();

router.get('/ping', (req, res) => res.send({ message: 'pong' }));

router.use('/auth', (req, res) => res.send({ message: 'here goes auth' }));

module.exports = router;
