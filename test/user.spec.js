const request = require('supertest');
const { sign } = require('jsonwebtoken');

// Constants.
const { httpStatusCode, errorMessage, modelName } = require('../src/constants');

// Configuration.
const configuration = require('../src/configuration');

// Setup.
const { buildResources, teardownResources } = require('./setup');

jest.setTimeout(30_000);

describe('User', () => {
  let context;

  beforeAll(async () => {
    context = await buildResources();
  });

  afterAll(async () => {
    await teardownResources(context);
  });

  describe('GET /user/:id', () => {
    const payload = { id: 1 };
    const { secret, accessTokenDuration } = configuration.jwt;
    const options = {
      algorithm: 'HS512',
      subject: 'ACCESS_TOKEN',
      expiresIn: accessTokenDuration
    };
    const token = sign(payload, secret, options);

    beforeEach(async () => {
      const User = context.database.model(modelName.USER);
      await User.create({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword'
      });
    });

    afterEach(async () => {
      const User = context.database.model(modelName.USER);
      await User.destroy({ where: {} });
    });

    it('Should return 404 status code and USER_NOT_FOUND message if user does not exist', async () => {
      const response = await request(context.app)
        .get('/user/2')
        .set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatusCode.NOT_FOUND);
      expect(response.body.message).toBe(errorMessage.USER_NOT_FOUND);
    });

    it('Should return 200 status code and user information', async () => {
      const response = await request(context.app)
        .get('/user/1')
        .set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatusCode.OK);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.id).toBe(1);
      expect(response.body.username).toBe('testuser');
    });
  });
});
