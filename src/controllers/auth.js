const authController = (database) => {

  // Services.
  const authService = require('../services/auth')(database);

  const signIn = async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.signIn({ username, password });
    res.send(result);
  };
  
  const signUp = async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.signUp({ username, password });
    res.send(result);
  };
  
  const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh({ refreshToken });
    res.send(result);
  };

  return {
    signIn,
    signUp,
    refresh,
  };
};

module.exports = authController;
