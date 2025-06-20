// Services.
const authService = require('../services/auth');

const signIn = async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.signIn({ username, password });
  res.send(result);
};

module.exports = {
  signIn,
};
