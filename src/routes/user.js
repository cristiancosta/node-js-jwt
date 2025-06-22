const express = require('express');

// Controllers.
const userController = require('../controllers/user');

// Middlewares.
const authBearer = require('../middlewares/auth-bearer');

const router = express.Router();

router.get('/:id', authBearer, userController.getUser);

module.exports = router;
