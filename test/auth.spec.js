const request = require("supertest");
const { hash } = require("bcryptjs");

// Constants.
const { httpStatusCode, errorMessage } = require("../src/constants");

// Models.
const User = require("../src/models/user");

// App.
const app = require("../src/app");

describe("Auth", () => {
  describe("POST /auth/sign-in", () => {
    beforeAll(async () => {
      await User.sync({ force: true });
      await User.create({
        username: "testuser",
        password: await hash("Abcdef2!", 10),
      });
    });

    afterAll(async () => {
      await User.destroy({ where: { } });
    });

    it("Should return 404 status code and USER_NOT_FOUND message if user does not exist", async () => {
      const response = await request(app)
        .post("/auth/sign-in")
        .send({ username: "nouser", password: "Abcdef1!" });

      expect(response.status).toBe(httpStatusCode.NOT_FOUND);
      expect(response.body.error).toBe(errorMessage.USER_NOT_FOUND);
    });

    it("Should return 400 status code and INVALID_CREDENTIALS message if credentials are not valid", async () => {
      const response = await request(app)
        .post("/auth/sign-in")
        .send({ username: "testuser", password: "Abcdef1!" });

      expect(response.status).toBe(httpStatusCode.BAD_REQUEST);
      expect(response.body.error).toBe(errorMessage.INVALID_CREDENTIALS);
    });

    it("Should return 200 status code and tokens if user exist and credentials are valid", async () => {
      const response = await request(app)
        .post("/auth/sign-in")
        .send({ username: "testuser", password: "Abcdef2!" });

      expect(response.status).toBe(httpStatusCode.OK);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });
  });
});
