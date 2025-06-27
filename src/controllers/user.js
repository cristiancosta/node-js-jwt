const userController = (dataSource) => {
  // Repositories.
  const userRepository = require('../repositories/user')(dataSource);

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
