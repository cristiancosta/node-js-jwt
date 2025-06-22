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
    const { message } = error;
    if (message === errorMessage.USER_NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND).send({ error: message });
    } else if (message === errorMessage.INVALID_CREDENTIALS) {
      res.status(httpStatusCode.BAD_REQUEST).send({ error: message });
    } else {
      console.error("signIn#error", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .send({ error: errorMessage.INTERNAL_SERVER_ERROR });
    }
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh({ refreshToken });
    res.send(result);
  } catch (error) {
    const { message } = error;
    if (message === errorMessage.INVALID_TOKEN) {
      res.status(httpStatusCode.UNAUTHORIZED).send({ error: message });
    } else if (message === errorMessage.TOKEN_EXPIRED) {
      res.status(httpStatusCode.UNAUTHORIZED).send({ error: message });
    } else if (message === errorMessage.USER_NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND).send({ error: message });
    } else {
      console.error("refresh#error", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .send({ error: errorMessage.INTERNAL_SERVER_ERROR });
    }
  }
};

module.exports = {
  signIn,
  refresh,
};
