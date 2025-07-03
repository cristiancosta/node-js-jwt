const { v4: uuidv4 } = require('uuid');
const { compareSync, hashSync } = require('bcryptjs');

// Errors.
const { BadRequestError } = require('../../../src/errors/bad-request');
const { ConflictError } = require('../../../src/errors/conflict');
const { NotFoundError } = require('../../../src/errors/not-found');
const { UnauthorizedError } = require('../../../src/errors/unauthorized');

// Services.
const authService = require('../../../src/services/auth');

// Utils
const { createJwt } = require('../../../src/utils/create-jwt');
const { verifyJwt } = require('../../../src/utils/verify-jwt');

jest.mock('bcryptjs');
jest.mock('uuid');
jest.mock('../../../src/utils/create-jwt');
jest.mock('../../../src/utils/verify-jwt');

describe('Auth', () => {
  let service;
  let userRepository;

  beforeEach(() => {
    userRepository = {
      getUserByUsername: jest.fn(),
      createUser: jest.fn(),
      updateRefreshUuid: jest.fn(),
      getUserByIdAndRefreshUuid: jest.fn()
    };
    service = authService({ userRepository });
  });

  describe('signIn', () => {
    it('Should throw NotFoundError if user does not exist', async () => {
      userRepository.getUserByUsername.mockResolvedValue(null);
      await expect(
        service.signIn({ username: 'user', password: 'pass' })
      ).rejects.toThrow(NotFoundError);
      expect(userRepository.getUserByUsername).toHaveBeenCalledWith('user');
    });

    it('Should throw BadRequestError if password is invalid', async () => {
      userRepository.getUserByUsername.mockResolvedValue({
        username: 'user',
        password: 'hashed'
      });
      compareSync.mockReturnValue(false);
      await expect(
        service.signIn({ username: 'user', password: 'wrong' })
      ).rejects.toThrow(BadRequestError);
    });

    it('Should return access and refresh tokens on successful login', async () => {
      const user = { id: 1, username: 'user', password: 'hashed' };
      userRepository.getUserByUsername.mockResolvedValue(user);
      compareSync.mockReturnValue(true);
      uuidv4.mockReturnValue('uuid-123');
      createJwt.mockImplementation(
        (sub, payload) => `${sub}-token-${payload.uuid || payload.id}`
      );

      const result = await service.signIn({
        username: 'user',
        password: 'valid'
      });

      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN-token-1',
        refreshToken: 'REFRESH_TOKEN-token-uuid-123'
      });
      expect(userRepository.updateRefreshUuid).toHaveBeenCalledWith(
        1,
        'uuid-123'
      );
    });
  });

  describe('signUp', () => {
    it('Should throw ConflictError if user already exists', async () => {
      userRepository.getUserByUsername.mockResolvedValue({ username: 'user' });
      await expect(
        service.signUp({ username: 'user', password: 'pass' })
      ).rejects.toThrow(ConflictError);
    });

    it('Should hash password and create user', async () => {
      userRepository.getUserByUsername.mockResolvedValue(null);
      hashSync.mockReturnValue('hashed');
      const createdUser = {
        id: 1,
        username: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      userRepository.createUser.mockResolvedValue(createdUser);

      const result = await service.signUp({
        username: 'user',
        password: 'pass'
      });
      expect(result).toMatchObject({
        id: createdUser.id,
        username: createdUser.username
      });
      expect(userRepository.createUser).toHaveBeenCalledWith({
        username: 'user',
        password: 'hashed'
      });
    });
  });

  describe('refresh', () => {
    it('Should throw UnauthorizedError if token is invalid or user not found', async () => {
      verifyJwt.mockReturnValue({ id: 1, uuid: 'uuid' });
      userRepository.getUserByIdAndRefreshUuid.mockResolvedValue(null);
      await expect(service.refresh({ refreshToken: 'token' })).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('Should return new tokens and update uuid', async () => {
      verifyJwt.mockReturnValue({ id: 1, uuid: 'old-uuid' });
      userRepository.getUserByIdAndRefreshUuid.mockResolvedValue({ id: 1 });
      uuidv4.mockReturnValue('new-uuid');
      createJwt.mockImplementation(
        (sub, payload) => `${sub}-token-${payload.uuid || payload.id}`
      );

      const result = await service.refresh({ refreshToken: 'token' });

      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN-token-1',
        refreshToken: 'REFRESH_TOKEN-token-new-uuid'
      });
      expect(userRepository.updateRefreshUuid).toHaveBeenCalledWith(
        1,
        'new-uuid'
      );
    });
  });
});
