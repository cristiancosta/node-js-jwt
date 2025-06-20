// Services.
const authService = require('../services/auth');

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.signIn({ username, password });
    res.send(result);
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      res.status(404).send({ error: error.message });
    } else {
      console.error('signIn#error', error);
      res.status(500).send({ error: 'INTERNAL_SERVER_ERROR' });
    }
  }
};

module.exports = {
  signIn,
};
