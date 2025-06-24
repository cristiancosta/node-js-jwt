const express = require('express');

const routes = (database) => {
  const router = express.Router();

  // Routes.
  const authRoute = require('./auth')(database);
  const healthRoute = require('./health')(database);
  const userRoute = require('./user')(database);

  router.use('/auth', authRoute);
  router.use('/health', healthRoute);
  router.use('/user', userRoute);

  return router;
};

module.exports = routes;

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
