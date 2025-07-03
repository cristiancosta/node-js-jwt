// Errors.
const { NotFoundError } = require('../../../src/errors/not-found');

// Services.
const userService = require('../../../src/services/user');

describe('User', () => {
  let service;
  let userRepository;

  beforeEach(() => {
    userRepository = {
      getUserById: jest.fn()
    };
    service = userService({ userRepository });
  });

  describe('getUser', () => {
    it('Should return user data if user exists', async () => {
      const fakeUser = {
        id: 1,
        username: 'testuser',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };
      userRepository.getUserById.mockResolvedValue(fakeUser);
      const result = await service.getUser({ id: 1 });
      expect(result).toEqual({
        id: fakeUser.id,
        username: fakeUser.username,
        createdAt: fakeUser.createdAt,
        updatedAt: fakeUser.updatedAt
      });
      expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    });

    it('Should throw NotFoundError if user does not exist', async () => {
      userRepository.getUserById.mockResolvedValue(null);
      await expect(service.getUser({ id: 99 })).rejects.toThrow(NotFoundError);
      expect(userRepository.getUserById).toHaveBeenCalledWith(99);
    });
  });
});
