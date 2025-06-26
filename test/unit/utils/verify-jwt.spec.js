const {
  verify,
  TokenExpiredError,
  JsonWebTokenError
} = require('jsonwebtoken');

// Constants.
const { tokenSubject, jwtAlgorithm } = require('../../../src/constants');

// Configuration.
const configuration = require('../../../src/configuration');

// Errors.
const UnauthorizedError = require('../../../src/errors/unauthorized');

// Utils.
const { verifyJwt } = require('../../../src/utils');

jest.mock('jsonwebtoken');

describe('verifyJwt', () => {
  const token = 'fake.jwt.token';
  const secret = 'testsecret';
  const expectedSubject = tokenSubject.ACCESS_TOKEN;

  beforeEach(() => {
    configuration.jwt = { secret };
    verify.mockReset();
  });

  it('Should return payload if token is valid and subject matches', () => {
    const payload = { id: 1, sub: expectedSubject };
    verify.mockReturnValue({ payload });

    const result = verifyJwt(token, expectedSubject);
    expect(result).toEqual(payload);
    expect(verify).toHaveBeenCalledWith(token, secret, {
      algorithms: [jwtAlgorithm.HS512],
      complete: true
    });
  });

  it('Should throw UnauthorizedError if subject does not match', () => {
    const payload = { id: 1, sub: tokenSubject.REFRESH_TOKEN };
    verify.mockReturnValue({ payload });

    expect(() => verifyJwt(token, expectedSubject)).toThrow(UnauthorizedError);
  });

  it('Should throw UnauthorizedError if token is expired', () => {
    const error = new TokenExpiredError('jwt expired', new Date());
    verify.mockImplementation(() => {
      throw error;
    });

    expect(() => verifyJwt(token, expectedSubject)).toThrow(UnauthorizedError);
  });

  it('Should throw UnauthorizedError if token is invalid', () => {
    const error = new JsonWebTokenError('invalid signature');
    verify.mockImplementation(() => {
      throw error;
    });

    expect(() => verifyJwt(token, expectedSubject)).toThrow(UnauthorizedError);
  });
});
