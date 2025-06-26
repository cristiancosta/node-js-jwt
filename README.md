# Node JS JWT

![Test Status](https://img.shields.io/badge/Jest-tested-brightgreen?logo=jest)
![Build Status](https://img.shields.io/badge/build-passing-success?logo=github)

## 🧰 Stack

[![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5.x-black?logo=express)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-secure-blue?logo=jsonwebtokens)](https://jwt.io/)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM-blue?logo=sequelize)](https://sequelize.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-UI-brightgreen?logo=swagger)](https://swagger.io/)
[![Jest](https://img.shields.io/badge/Tested%20with-Jest-99425b?logo=jest)](https://jestjs.io/)
[![Testcontainers](https://img.shields.io/badge/Testcontainers-Integration--Testing-green?logo=docker)](https://testcontainers.com/)
[![Husky](https://img.shields.io/badge/Husky-Git%20Hooks-8e44ad?logo=git)](https://typicode.github.io/husky/)
[![Supertest](https://img.shields.io/badge/Supertest-API%20Testing-blueviolet)](https://github.com/visionmedia/supertest)
[![Prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg?logo=prettier)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/linting-eslint-yellow?logo=eslint)](https://eslint.org/)

---

## 🔐 Introduction

This is a REST API built with **JavaScript**, **Node.js** and **Express** that implements secure authentication using **JSON Web Tokens (JWT)**. It's a great base for systems that require login, user management, and access control via tokens.

Features include:

- 🔒 Authentication with **Access Token** and **Refresh Token**.
- 📖 Interactive API documentation via **Swagger UI**.
- 🧪 Real **PostgreSQL** integration testing using **Testcontainers**.
- ✨ **ESLint** + **Prettier** + **Husky** for code quality enforcement.
- 🔁 **GitHub Actions** for automated CI/CD.

---

## 📁 Project Structure

```
├── .github/
├── .husky/
├── src/
|   ├── constants/          # HTTP codes, error messages, table/model names.
|   ├── controllers/        # Endpoint logic.
|   ├── errors/             # Custom error classes.
|   ├── middlewares/        # Auth, error handling, swagger auth.
|   ├── models/             # Sequelize models.
|   ├── repositories/       # Data access abstraction.
|   ├── routes/             # Route definitions.
|   ├── services/           # Business logic.
|   ├── utils/              # Reusable functions.
|   ├── app.js              # Express app configuration.
|   ├── configuration.js    # .env configuration entry point.
|   ├── sequelize.js        # Sequelize configuration.
|   ├── swagger.js          # Swagger configuration.
|   └── server.js           # Entry point.
├── test/                   # Unit and integration tests using jest, supertest and testcontainers.
├── .gitignore              # Default gitignore file provided by GitHub.
├── .prettierrc             # Prettier configuration file.
├── eslint.config.mjs       # ESLint configuration file.
├── LICENSE                 # MIT License.
├── package-lock.json       # Exact project dependencies tree.
├── package.json            # Project dependencies, scripts and more stuff.
└── README.md               # Current file.
```

---

## 🚀 Quick Installation

```bash
git clone https://github.com/cristiancosta/node-js-jwt.git
cd node-js-jwt
npm install
```

Then create a `.env` file in the project root with the following content:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=nodejwt
DB_PORT=5432

SERVER_PORT=8081

JWT_SECRET=mysecret
JWT_ACCESS_TOKEN_DURATION=2 hours
JWT_REFRESH_TOKEN_DURATION=2 days

SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=admin
```

Make sure you have a PostgreSQL database up and running. In my case, I use Docker since it's the easiest way:

```bash
$ docker run -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -d postgres
```

Log into the container and create the database:

```bash
$ docker exec -it <CONTAINER_ID> psql -U root
$ CREATE DATABASE nodejwt;
```

Start the server:

```bash
npm start
```

📍 The API will be available at: `http://localhost:8081`

---

## 📚 Interactive Documentation

You can explore and test all endpoints using Swagger UI:

🔗 [http://localhost:8081/api-docs/](http://localhost:8081/api-docs/)

Basic Auth required:

- **Username:** `admin`
- **Password:** `admin`

You can change Swagger credentials on `.env` file.

---

## 🧪 Testing with Testcontainers

This project uses **Testcontainers** to spin up a real PostgreSQL instance during tests. This ensures:

- A test environment **identical to production**.
- No fragile mocks.
- Automatic container cleanup.

Run tests:

```bash
npm test
```

---

## ✅ Husky + Pre-commit hooks

The project uses **Husky** to automatically run the following before each commit:

```bash
npx lint-staged  # Runs ESLint + Prettier
npm test         # Executes integration tests
```

---

## ⚙️ GitHub Actions CI

The project runs automated tests on Node.js 18, 20 and 22 via GitHub Actions.

---

## 🛠️ Useful Scripts

| Command            | Description                              |
|--------------------|------------------------------------------|
| `npm start`        | Starts the server with Nodemon           |
| `npm test`         | Runs all tests using Jest + Testcontainers |
| `npm run lint`     | Lints the code using ESLint              |
| `npm run lint:fix` | Lints and auto-fixes issues              |
| `npm run format`   | Formats code with Prettier               |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo.
2. Create a new branch.
3. Submit a Pull Request.
4. Make sure lint and tests pass.

📩 For direct contact: **cristiancosta1991@gmail.com**  
🌟 Found it useful? Give the project a ⭐ on GitHub!

[https://github.com/cristiancosta/node-js-jwt](https://github.com/cristiancosta/node-js-jwt)

---

## ☕ Donations

If you'd like to support this project, feel free to donate a coffee: [![Ko-Fi](https://img.shields.io/badge/Ko--fi-Donate-red?logo=ko-fi)](https://ko-fi.com/cristiancosta)

---

## 📝 License

MIT © [Cristian Costa](mailto:cristiancosta1991@gmail.com)
