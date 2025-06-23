const userController = (database) => {

  // Services.
  const userService = require('../services/user')(database);

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
