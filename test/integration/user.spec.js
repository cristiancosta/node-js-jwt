const request = require('supertest');

// Constants.
const {
  httpStatusCode,
  errorMessage,
  modelName,
  tokenSubject
} = require('../../src/constants');

// Utils.
const { createJwt } = require('../../src/utils');

// Setup.
const { buildResources, teardownResources } = require('./setup');

describe('User', () => {
  let context;

  beforeAll(async () => {
    context = await buildResources();
  }, 60_000);

  afterAll(async () => {
    if (context) {
      await teardownResources(context);
    }
  });

  describe('GET /user/:id', () => {
    const payload = { id: 1 };
    const accessToken = createJwt(tokenSubject.ACCESS_TOKEN, payload);

    beforeEach(async () => {
      const User = context.dataSource.model(modelName.USER);
      await User.create({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword'
      });
    });

    afterEach(async () => {
      const User = context.dataSource.model(modelName.USER);
      await User.destroy({ where: {} });
    });

    it('Should return 404 status code and USER_NOT_FOUND message if user does not exist', async () => {
      const response = await request(context.app)
        .get('/user/2')
        .set('authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatusCode.NOT_FOUND);
      expect(response.body.message).toBe(errorMessage.USER_NOT_FOUND);
    });

    it('Should return 200 status code and user information', async () => {
      const response = await request(context.app)
        .get('/user/1')
        .set('authorization', `Bearer ${accessToken}`);

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
