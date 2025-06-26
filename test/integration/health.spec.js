const request = require('supertest');

// Constants.
const { httpStatusCode } = require('../../src/constants');

// Setup.
const { buildResources, teardownResources } = require('./setup');

jest.setTimeout(30_000);

describe('Health', () => {
  let context;

  beforeAll(async () => {
    context = await buildResources();
  });

  afterAll(async () => {
    await teardownResources(context);
  });

  describe('GET /health', () => {
    it('Should return 200 status code and with healthy status and connected database information', async () => {
      const response = await request(context.app).get('/health');

      expect(response.status).toBe(httpStatusCode.OK);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('dependencies');
      expect(response.body.dependencies).toHaveProperty('database');
      expect(response.body.status).toEqual('healthy');
      expect(response.body.dependencies.database).toEqual('connected');
    });

    it('Should return 200 status code and with healthy status and not-connected database information', async () => {
      await context.database.close();
      const response = await request(context.app).get('/health');

      expect(response.status).toBe(httpStatusCode.OK);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('dependencies');
      expect(response.body.dependencies).toHaveProperty('database');
      expect(response.body.dependencies).toHaveProperty('reason');
      expect(response.body.status).toEqual('healthy');
      expect(response.body.dependencies.database).toEqual('not-connected');
    });
  });
});
