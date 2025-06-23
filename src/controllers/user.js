// Services.
const userService = require('../services/user');

const getUser = async (req, res) => {
  const { id } = req.params;
  const result = await userService.getUser({ id });
  res.send(result);
};

module.exports = {
  getUser
};
