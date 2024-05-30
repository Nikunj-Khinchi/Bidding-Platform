const request = require("supertest");
const app = require("../app"); // Adjust the path as needed
const sequelize = require("../config/database"); // Adjust the path as needed

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth Endpoints", () => {
  describe("POST /users/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/users/register").send({
        username: "testuser-auth-test",
        email: "testuser_auth_test@example.com",
        password: "password123",
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty( "message");
    });

    it("should return an error if the user already exists", async () => {
      await request(app).post("/users/register").send({
        username: "testuser_error_test",
        email: "testuser_error_test@example.com",
        password: "password123",
        role: "user",
      });

      request(app)
        .post("/users/register")
        .send({
          username: "testuser_error_test",
          email: "testuser_error_test@example.com",
          password: "password123",
          role: "user",
        })
        .then((res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty("message", "User already exists");
        });
      // expect(res.statusCode).toEqual(400);
      // expect(res.body).toHaveProperty("message", "User already exists");
    });
  });

  describe("POST /users/login", () => {
    it("should login an existing user", async () => {
      await request(app).post("/users/register").send({
        username: "testuser_login",
        email: "testuser_login@example.com",
        password: "password123",
        role: "user",
      });

      const res = await request(app).post("/users/login").send({
        email: "testuser_login@example.com",
        password: "password123",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return an error if credentials are invalid", async () => {
      const res = await request(app).post("/users/login").send({
        email: "nonexistentuser@example.com",
        password: "wrongpassword",
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});
