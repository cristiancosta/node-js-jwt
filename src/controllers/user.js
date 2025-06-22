// Constants.
const { httpStatusCode, errorMessage } = require("../constants");

// Services.
const userService = require("../services/user");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.getUser({ id });
    res.send(result);
  } catch (error) {
    const { message } = error;
    if (message === errorMessage.USER_NOT_FOUND) {
      res.status(httpStatusCode.NOT_FOUND).send({ error: message });
    } else {
      console.error("getUser#error", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .send({ error: errorMessage.INTERNAL_SERVER_ERROR });
    }
  }
};

module.exports = {
  getUser,
};
