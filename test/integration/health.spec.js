const request = require('supertest');

// Constants.
const { httpStatusCode } = require('../../src/constants/http-status-code');

// Setup.
const { buildResources, teardownResources } = require('./setup');

describe('Health', () => {
  let context;

  beforeAll(async () => {
    context = await buildResources();
  }, 60_000);

  afterAll(async () => {
    if (context) {
      await teardownResources(context);
    }
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
      await context.dataSource.close();
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
