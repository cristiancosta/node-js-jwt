const express = require('express');

// Controllers.
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/sign-in', authController.signIn);

router.post('/refresh', authController.refresh);

module.exports = router;
