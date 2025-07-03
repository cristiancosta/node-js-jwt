const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const { sign } = require('jsonwebtoken');
const { compareSync, hashSync } = require('bcryptjs');

// Constants.
const { errorMessage } = require('../../src/constants/error-message');
const { httpStatusCode } = require('../../src/constants/http-status-code');
const { modelName } = require('../../src/constants/model-name');
const { tokenSubject } = require('../../src/constants/token-subject');

// Configuration.
const { configuration } = require('../../src/configuration');

// Utils.
const { createJwt } = require('../../src/utils/create-jwt');
const { verifyJwt } = require('../../src/utils/verify-jwt');

// Setup.
const { buildResources, teardownResources } = require('./setup');

describe('Auth', () => {
  let context;

  beforeAll(async () => {
    context = await buildResources();
  }, 60_000);

  afterAll(async () => {
    if (context) {
      await teardownResources(context);
    }
  });

  describe('POST /auth/sign-in', () => {
    let User;

    beforeEach(async () => {
      User = context.dataSource.model(modelName.USER);
      await User.create({
        username: 'testuser',
        password: hashSync('Abcdef2!', 10)
      });
    });

    afterEach(async () => {
      User = context.dataSource.model(modelName.USER);
      await User.destroy({ where: {} });
    });

    it('Should return 404 status code and USER_NOT_FOUND message if user does not exist', async () => {
      const response = await request(context.app)
        .post('/auth/sign-in')
        .send({ username: 'nouser', password: 'Abcdef1!' });

      expect(response.status).toBe(httpStatusCode.NOT_FOUND);
      expect(response.body.message).toBe(errorMessage.USER_NOT_FOUND);
    });

    it('Should return 400 status code and INVALID_CREDENTIALS message if credentials are not valid', async () => {
      const response = await request(context.app)
        .post('/auth/sign-in')
        .send({ username: 'testuser', password: 'Abcdef1!' });

      expect(response.status).toBe(httpStatusCode.BAD_REQUEST);
      expect(response.body.message).toBe(errorMessage.INVALID_CREDENTIALS);
    });

    it('Should return 200 status code and tokens if user exist and credentials are valid', async () => {
      const username = 'testuser';
      const password = 'Abcdef2!';
      const response = await request(context.app)
        .post('/auth/sign-in')
        .send({ username, password });

      expect(response.status).toBe(httpStatusCode.OK);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      const { accessToken, refreshToken } = response.body;
      const verifiedAccessTokenJwt = verifyJwt(
        accessToken,
        tokenSubject.ACCESS_TOKEN
      );
      const verifiedRefreshTokenJwt = verifyJwt(
        refreshToken,
        tokenSubject.REFRESH_TOKEN
      );
      expect(verifiedAccessTokenJwt).toHaveProperty('id');
      expect(verifiedRefreshTokenJwt).toHaveProperty('id');
      expect(verifiedRefreshTokenJwt).toHaveProperty('uuid');

      const dbUser = await User.findOne({ where: { username } });
      expect(verifiedRefreshTokenJwt.uuid).toEqual(dbUser.refresh_uuid);
    });
  });

  describe('POST /auth/sign-up', () => {
    let User;

    beforeEach(async () => {
      User = context.dataSource.model(modelName.USER);
      await User.create({
        id: 50,
        username: 'testuser',
        password: hashSync('Abcdef2!', 10)
      });
    });

    afterEach(async () => {
      User = context.dataSource.model(modelName.USER);
      await User.destroy({ where: {} });
    });

    it('Should return 409 status code and USER_ALREADY_EXIST message if the given username was taken before', async () => {
      const response = await request(context.app)
        .post('/auth/sign-up')
        .send({ username: 'testuser', password: 'Abcdef1!' });

      expect(response.status).toBe(httpStatusCode.CONFLICT);
      expect(response.body.message).toBe(errorMessage.USER_ALREADY_EXIST);
    });

    it('Should return 200 status code and created user data', async () => {
      const username = 'testuser2';
      const password = 'Abcdef2!';
      const response = await request(context.app)
        .post('/auth/sign-up')
        .send({ username, password });

      expect(response.status).toBe(httpStatusCode.OK);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      const dbUser = await User.findOne({ where: { username } });
      expect(dbUser).not.toBeNull();
      expect(dbUser.username).toBe(username);
      expect(dbUser.password).not.toBe(password);
      expect(compareSync(password, dbUser.password)).toBe(true);
    });
  });

  describe('POST /auth/refresh', () => {
    let User;

    beforeEach(async () => {
      User = context.dataSource.model(modelName.USER);
      await User.create({
        id: 100,
        username: 'testuser',
        password: hashSync('Abcdef2!', 10)
      });
    });

    afterEach(async () => {
      User = context.dataSource.model(modelName.USER);
      await User.destroy({ where: {} });
    });

    it('Should return 401 status code and TOKEN_EXPIRED message if refresh token is expired', async () => {
      const payload = { id: 1 };
      const { secret } = configuration.jwt;
      const options = {
        algorithm: 'HS512',
        subject: 'REFRESH_TOKEN',
        expiresIn: '1ms'
      };
      const refreshToken = sign(payload, secret, options);

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(httpStatusCode.UNAUTHORIZED);
      expect(response.body.message).toBe(errorMessage.TOKEN_EXPIRED);
    });

    it('Should return 401 status code and INVALID_TOKEN message if refresh token is invalid', async () => {
      const payload = { id: 1 };
      const options = {
        algorithm: 'HS512',
        subject: 'REFRESH_TOKEN',
        expiresIn: '7d'
      };
      const refreshToken = sign(payload, 'invalid-secret', options);

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(httpStatusCode.UNAUTHORIZED);
      expect(response.body.message).toBe(errorMessage.INVALID_TOKEN);
    });

    it('Should return 401 status code and INVALID_TOKEN_SUBJECT message if refresh token has invalid subject', async () => {
      const payload = { id: 1 };
      const accessToken = createJwt(tokenSubject.ACCESS_TOKEN, payload);

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken: accessToken });

      expect(response.status).toBe(httpStatusCode.UNAUTHORIZED);
      expect(response.body.message).toBe(errorMessage.INVALID_TOKEN_SUBJECT);
    });

    it('Should return 401 status code and INVALID_USER_TOKEN message if refresh token does not belong to user', async () => {
      const uuid = uuidv4();
      const payload = { id: 1, uuid };
      const refreshToken = createJwt(tokenSubject.REFRESH_TOKEN, payload);
      await User.update({ refresh_uuid: uuid }, { where: { id: 100 } });

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(httpStatusCode.UNAUTHORIZED);
      expect(response.body.message).toBe(errorMessage.INVALID_USER_TOKEN);
    });

    it('Should return 200 status code and new tokens if refresh token has valid subject, valid content and user exist', async () => {
      const payload = { id: 100, uuid: uuidv4() };
      const refreshToken = createJwt(tokenSubject.REFRESH_TOKEN, payload);
      await User.update(
        { refresh_uuid: payload.uuid },
        { where: { id: payload.id } }
      );

      const response = await request(context.app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(httpStatusCode.OK);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.refreshToken).not.toEqual(refreshToken);
      const { refresh_uuid } = await User.findByPk(payload.id);
      expect(payload.uuid).not.toEqual(refresh_uuid);
      const newRefreshToken = createJwt(tokenSubject.REFRESH_TOKEN, {
        id: payload.id,
        uuid: refresh_uuid
      });
      expect(response.body.refreshToken).toEqual(newRefreshToken);
    });
  });
});
