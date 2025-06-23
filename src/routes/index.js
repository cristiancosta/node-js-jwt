const express = require('express');

// Routes.
const authRoute = require('./auth');
const healthRoute = require('./health');
const userRoute = require('./user');

const router = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserNotFoundResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: USER_NOT_FOUND
 *     InternalServerErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: INTERNAL_SERVER_ERROR
 *     InvalidTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: INVALID_TOKEN
 *     InvalidAuthorizationPrefixResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: INVALID_AUTHORIZATION_PREFIX
 *     TokenExpiredResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: TOKEN_EXPIRED
 *     MissingAuthorizationHeaderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: MISSING_AUTHORIZATION_HEADER
 *     MissingAuthorizationHeaderValueResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: MISSING_AUTHORIZATION_HEADER_VALUE
 */
router.use('/auth', authRoute);
router.use('/health', healthRoute);
router.use('/user', userRoute);

module.exports = router;
