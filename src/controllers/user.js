const userController = (database) => {
  // Repositories.
  const userRepository = require('../repositories/user')(database);

  // Services.
  const userService = require('../services/user')({ userRepository });

  const getUser = async (req, res) => {
    const { id } = req.params;
    const result = await userService.getUser({ id });
    res.send(result);
  };

  return {
    getUser
  };
};

module.exports = userController;
