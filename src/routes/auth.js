const express = require('express');

const authRoute = (database) => {
  const router = express.Router();

  // Controllers.
  const authController = require('../controllers/auth')(database);

  /**
   * @swagger
   * /auth/sign-in:
   *  post:
   *    summary: Sign in user
   *    description: Sign in user
   *    tags:
   *      - Authentication
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              username:
   *                type: string
   *                description: User name
   *                example: myusername
   *              password:
   *                type: string
   *                description: User password
   *                example: pa55w0rd
   *            required:
   *              - username
   *              - password
   *    responses:
   *      200:
   *        description: Access and refresh tokens
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LoginResponse'
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InvalidCredentialsResponse'
   *      404:
   *        description: Not found
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserNotFoundResponse'
   *      500:
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InternalServerErrorResponse'
   */
  router.post('/sign-in', authController.signIn);

  /**
   * @swagger
   * /auth/sign-up:
   *  post:
   *    summary: Sign up user
   *    description: Sign up user
   *    tags:
   *      - Authentication
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              username:
   *                type: string
   *                description: User name
   *                example: myusername
   *              password:
   *                type: string
   *                description: User password
   *                example: pa55w0rd
   *            required:
   *              - username
   *              - password
   *    responses:
   *      200:
   *        description: Created user
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SignUpResponse'
   *      409:
   *        description: Conflict
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserAlreadyExistResponse'
   *      500:
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InternalServerErrorResponse'
   */
  router.post('/sign-up', authController.signUp);

  /**
   * @swagger
   * /auth/refresh:
   *  post:
   *    summary: Refresh user tokens
   *    description: Refresh user tokens
   *    tags:
   *      - Authentication
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              refreshToken:
   *                type: string
   *                description: Refresh token
   *            required:
   *              - refreshToken
   *    responses:
   *      200:
   *        description: New access and refresh tokens
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LoginResponse'
   *      401:
   *        description: Unauthorized
   *        content:
   *          application/json:
   *            schema:
   *              oneOf:
   *                - $ref: '#/components/schemas/InvalidTokenResponse'
   *                - $ref: '#/components/schemas/TokenExpiredResponse'
   *                - $ref: '#/components/schemas/InvalidUserTokenResponse'
   *      500:
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/InternalServerErrorResponse'
   */
  router.post('/refresh', authController.refresh);

  return router;
};

module.exports = authRoute;

/**
 * @swagger
 * components:
 *  schemas:
 *    LoginResponse:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *          description: Access token
 *        refreshToken:
 *          type: string
 *          description: Refresh token
 *    SignUpResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: User identifier
 *          example: 1
 *        username:
 *          type: string
 *          description: User name
 *          example: myusername
 *        createdAt:
 *          type: string
 *          description: User created at
 *          example: 2025-06-22T20:13:10.325Z
 *        updatedAt:
 *          type: string
 *          description: User updated at
 *          example: 2025-06-22T20:13:10.325Z
 *    InvalidCredentialsResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: INVALID_CREDENTIALS
 *    UserAlreadyExistResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: USER_ALREADY_EXIST
 *    InvalidUserTokenResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: INVALID_USER_TOKEN
 */
