// Constants.
const { httpStatusCode, errorMessage } = require("../constants");

// Services.
const authService = require("../services/auth");

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.signIn({ username, password });
    res.send(result);
  } catch (error) {
    if (error.message === errorMessage.USER_NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND).send({ error: error.message });
    } else if (error.message === errorMessage.INVALID_CREDENTIALS) {
      res.status(httpStatusCode.BAD_REQUEST).send({ error: error.message });
    } else {
      console.error("signIn#error", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .send({ error: errorMessage.INTERNAL_SERVER_ERROR });
    }
  }
};

module.exports = {
  signIn,
};
