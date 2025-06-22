const request = require('supertest');
const { sign } = require('jsonwebtoken');

// Constants.
const { httpStatusCode, errorMessage } = require('../src/constants');

// Models.
const User = require('../src/models/user');

// App.
const app = require('../src/app');

// Configuration.
const configuration = require('../src/configuration');

describe('User', () => {
  describe('GET /user/:id', () => {
    beforeAll(async () => {
      await User.create({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword'
      });
    });

    afterAll(async () => {
      await User.destroy({ where: {} });
    });

    // it("", async () => {});

    it('Should return 404 status code and USER_NOT_FOUND message if user does not exist', async () => {
      const payload = { id: 1 };
      const { secret, accessTokenDuration } = configuration.jwt;
      const options = {
        algorithm: 'HS512',
        subject: 'ACCESS_TOKEN',
        expiresIn: accessTokenDuration
      };
      const token = sign(payload, secret, options);

      const response = await request(app)
        .get('/user/2')
        .set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatusCode.NOT_FOUND);
      expect(response.body.error).toBe(errorMessage.USER_NOT_FOUND);
    });
  });
});
