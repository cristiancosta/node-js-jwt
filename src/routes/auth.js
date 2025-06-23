const express = require('express');

// Controllers.
const authController = require('../controllers/auth');

const router = express.Router();

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
 *    InvalidCredentialsResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: INVALID_CREDENTIALS
 *    UserNotFoundResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: USER_NOT_FOUND
 *    InternalServerErrorResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *          example: INTERNAL_SERVER_ERROR
 */

/**
 * @swagger
 * /auth/sign-in:
 *  post:
 *    summary: Authenticate user
 *    description: Authenticate user
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
 *        description: Access token and refresh token
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

router.post('/sign-up', authController.signUp);

router.post('/refresh', authController.refresh);

module.exports = router;
