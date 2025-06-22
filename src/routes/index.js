const express = require('express');

// Routes.
const authRoute = require('./auth');
const healthRoute = require('./health');
const userRoute = require('./user');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/health', healthRoute);
router.use('/user', userRoute);

module.exports = router;
