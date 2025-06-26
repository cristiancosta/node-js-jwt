const { sign } = require('jsonwebtoken');

// Constants.
const {
  tokenSubject,
  jwtAlgorithm,
  errorMessage
} = require('../../../src/constants');

// Configuration.
const configuration = require('../../../src/configuration');

// Errors.
const ConflictError = require('../../../src/errors/conflict');

// Utils.
const { createJwt } = require('../../../src/utils');

jest.mock('jsonwebtoken');

describe('createJwt', () => {
  const payload = { id: 1 };
  const secret = 'testsecret';

  beforeEach(() => {
    sign.mockReset();
    configuration.jwt = {
      secret,
      accessTokenDuration: '15m',
      refreshTokenDuration: '2h'
    };
  });

  it('Should create a valid access token', () => {
    sign.mockReturnValue('access.token.value');
    const result = createJwt(tokenSubject.ACCESS_TOKEN, payload);
    expect(sign).toHaveBeenCalledWith(payload, secret, {
      algorithm: jwtAlgorithm.HS512,
      subject: tokenSubject.ACCESS_TOKEN,
      expiresIn: configuration.jwt.accessTokenDuration
    });
    expect(result).toBe('access.token.value');
  });

  it('Should create a valid refresh token', () => {
    sign.mockReturnValue('refresh.token.value');
    const result = createJwt(tokenSubject.REFRESH_TOKEN, payload);
    expect(sign).toHaveBeenCalledWith(payload, secret, {
      algorithm: jwtAlgorithm.HS512,
      subject: tokenSubject.REFRESH_TOKEN,
      expiresIn: configuration.jwt.refreshTokenDuration
    });
    expect(result).toBe('refresh.token.value');
  });

  it('Should throw ConflictError for invalid subject', () => {
    expect(() => createJwt('INVALID_SUBJECT', payload)).toThrow(ConflictError);
    expect(() => createJwt('INVALID_SUBJECT', payload)).toThrow(
      errorMessage.INVALID_TOKEN_SUBJECT
    );
    expect(sign).not.toHaveBeenCalled();
  });
});
