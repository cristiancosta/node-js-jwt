const request = require('supertest');

// Constants.
const {  httpStatusCode, errorMessage} = require('../src/constants');

// Models.
const User = require('../src/models/user');

// App.
const app = require('../src/app');

describe('Auth', () => {
  describe('POST /auth/sign-in', () => {

    beforeEach(async () => {
      await User.destroy({ where: {} });
      await User.create({
        username: 'testuser',
        password: await hash('Abcdef2!', 10),
      });
    });

    it('Should return 404 status code and USER_NOT_FOUND message if user does not exist', async () => {
      const response = await request(app).post('/auth/sign-in').send({ username: 'nouser', password: 'Abcdef1!' });

      expect(response.status).toBe(httpStatusCode.NOT_FOUND);
      expect(response.body.error).toBe(errorMessage.USER_NOT_FOUND);
    });
  });
});
