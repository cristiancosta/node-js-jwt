// Constants.
const { errorMessage, tokenSubject } = require('../../../src/constants');

// Errors.
const UnauthorizedError = require('../../../src/errors/unauthorized');
const ConflictError = require('../../../src/errors/conflict');

// Middlewares.
const { authBearer } = require('../../../src/middlewares');

// Utils.
const { verifyJwt } = require('../../../src/utils');

// Mock de verifyJwt
jest.mock('../../../src/utils', () => ({
  verifyJwt: jest.fn()
}));

describe('authBearer', () => {
  const createMockReq = (authHeader) => ({
    headers: { authorization: authHeader }
  });
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw UnauthorizedError when Authorization header is missing', () => {
    const req = createMockReq(undefined);
    expect(() => authBearer(req, res, next)).toThrow(UnauthorizedError);
    expect(() => authBearer(req, res, next)).toThrow(
      errorMessage.MISSING_AUTHORIZATION_HEADER
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when Authorization header is empty', () => {
    const req = createMockReq('');
    expect(() => authBearer(req, res, next)).toThrow(UnauthorizedError);
    expect(() => authBearer(req, res, next)).toThrow(
      errorMessage.MISSING_AUTHORIZATION_HEADER_VALUE
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw ConflictError when Authorization prefix is not Bearer', () => {
    const req = createMockReq('Token abc.def.ghi');
    expect(() => authBearer(req, res, next)).toThrow(ConflictError);
    expect(() => authBearer(req, res, next)).toThrow(
      errorMessage.INVALID_AUTHORIZATION_PREFIX
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call verifyJwt and next() when token is valid and prefix is Bearer', () => {
    const token = 'abc.def.ghi';
    const req = createMockReq(`Bearer ${token}`);

    verifyJwt.mockReturnValue({ id: 1 });

    authBearer(req, res, next);

    expect(verifyJwt).toHaveBeenCalledWith(token, tokenSubject.ACCESS_TOKEN);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
